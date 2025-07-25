import { Request, Response } from "express";
import { PageService } from "../services/PageService";
import { CreatePageDto, PageFilterDto } from "../dto/PageDto";
import { PageType } from "../entities/Page";
import { MetricState } from "../entities/Metric";
import { S3Service } from "../services/S3Service";

export class PageController {
    private s3Service: S3Service;

    constructor(private pageService: PageService) {
        this.s3Service = new S3Service();
    }

    /**
     * Create a page and trigger metric generation for the corresponding service
     */
    async createPage(req: Request, res: Response): Promise<void> {
        try {
            const { type, date, svc_id } = req.body;
            
            // Validate required fields
            if (!type || !Object.values(PageType).includes(type)) {
                res.status(400).json({
                    success: false,
                    error: "type is required and must be either 'DAILY' or 'WEEKLY'"
                });
                return;
            }

            if (!date || typeof date !== 'string') {
                res.status(400).json({
                    success: false,
                    error: "date is required and must be a string in DD-MM-YYYY format"
                });
                return;
            }

            // Validate date format (DD-MM-YYYY)
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(date)) {
                res.status(400).json({
                    success: false,
                    error: "date must be in DD-MM-YYYY format (e.g., '25-12-2023')"
                });
                return;
            }

            if (!svc_id || typeof svc_id !== 'number') {
                res.status(400).json({
                    success: false,
                    error: "svc_id is required and must be a number"
                });
                return;
            }

            const createPageDto: CreatePageDto = {
                type: type as PageType,
                date,
                svc_id
            };

            console.log(`[PageController] Creating page for service ${svc_id} with type ${type}`);

            const result = await this.pageService.createPageAndGenerateMetrics(createPageDto);
            
            res.status(201).json({
                success: true,
                message: "Page created and metric generation triggered successfully",
                data: {
                    page: result.page,
                    metricGeneration: result.metricGeneration
                }
            });

        } catch (error) {
            console.error('[PageController] Error creating page:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    /**
     * Get pages by service ID
     */
    async getPagesByService(req: Request, res: Response): Promise<void> {
        try {
            const svc_id = Number(req.params.svc_id);
            
            if (isNaN(svc_id)) {
                res.status(400).json({
                    success: false,
                    response: {
                        message: "Error"
                    }
                });
                return;
            }

            console.log("Getting pages by service", svc_id);
            const response = await this.pageService.getPagesByServiceForAPI(svc_id);
            console.log("Response", response);
            res.status(200).json({
                success: true,
                response: response
            });
        } catch (error) {
            console.error('[PageController] Error getting pages by service:', error);
            res.status(500).json({
                success: false,
                response: {
                    message: "Error"
                }
            });
        }
    }

    /**
     * Get page by ID with all metrics compilation
     */
    async getPageWithMetrics(req: Request, res: Response): Promise<void> {
        try {
            const page_id = Number(req.params.page_id);
            
            if (isNaN(page_id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid page ID"
                });
                return;
            }

            const pageWithMetrics = await this.pageService.getPageWithMetrics(page_id);
            
            if (!pageWithMetrics) {
                res.status(404).json({
                    success: false,
                    error: "Page not found"
                });
                return;
            }

            // Generate presigned URLs for metric images
            const metricsWithPresignedUrls = await Promise.all(
                pageWithMetrics.metrics.map(async (metric) => {
                    let presignedImageUrl = metric.image_url || "/anomaly_detection_plot.png";
                    
                    // Generate presigned URL if the image_url is not already a full URL
                    if (metric.image_url && !metric.image_url.startsWith('http') && !metric.image_url.startsWith('/')) {
                        try {
                            presignedImageUrl = await this.s3Service.generateMetricImageURL(metric.image_url);
                        } catch (error) {
                            console.error(`[PageController] Error generating presigned URL for metric ${metric.id}:`, error);
                            // Keep original URL if presigned URL generation fails
                            presignedImageUrl = metric.image_url;
                        }
                    }
                    
                    return {
                        ...metric,
                        presignedImageUrl
                    };
                })
            );

            const responseWithPresignedUrls = {
                ...pageWithMetrics,
                metrics: metricsWithPresignedUrls
            };
            
            res.status(200).json({
                success: true,
                data: responseWithPresignedUrls
            });
        } catch (error) {
            console.error('[PageController] Error getting page with metrics:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Get page details in the specified API format
     */
    async getPageDetails(req: Request, res: Response): Promise<void> {
        try {
            const page_id = Number(req.params.page_id);
            
            if (isNaN(page_id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid page ID"
                });
                return;
            }

            const pageWithMetrics = await this.pageService.getPageWithMetrics(page_id);
            
            if (!pageWithMetrics) {
                res.status(404).json({
                    success: false,
                    error: "Page not found"
                });
                return;
            }

            // Convert date from epoch to YYYY-MM-DD format
            const formatDate = (epoch?: number): string => {
                if (!epoch) return "2024-01-15"; // fallback date
                const date = new Date(epoch);
                return date.toISOString().split('T')[0];
            };
            console.log("pageWithMetrics", pageWithMetrics);

            // Generate presigned URLs for metric images
            // Merge metricsWithPresignedUrls and anomalies mapping into a single step
            const anomalies = await Promise.all(
                pageWithMetrics.metrics.map(async (metric) => {
                    let presignedImageUrl = metric.image_url || "/anomaly_detection_plot.png";
                    
                    // Generate presigned URL if the image_url is not already a full URL
                    if (metric.image_url && !metric.image_url.startsWith('http') && !metric.image_url.startsWith('/')) {
                        try {
                            presignedImageUrl = await this.s3Service.generateMetricImageURL(metric.image_url);
                        } catch (error) {
                            console.error(`[PageController] Error generating presigned URL for metric ${metric.id}:`, error);
                            // Keep original URL if presigned URL generation fails
                            presignedImageUrl = metric.image_url;
                        }
                    }
                    
                    return {
                        id: metric.id,
                        title: metric.name || `Metric ${metric.id}`,
                        criticalityScore: metric.criticalityScore || 0,
                        description: metric.summary_text || `Anomaly detected in ${metric.name || 'metric'}`,
                        graphImage: presignedImageUrl,
                        state: this.getMetricState(metric.state) || "unresolved"
                    };
                })
            );

            // Sort anomalies by criticality score (highest first) and assign severity levels
            const sortedAnomalies = anomalies
                .sort((a, b) => (b.criticalityScore || 0) - (a.criticalityScore || 0))
                .map((anomaly, index) => {
                    let severity: string;
                    if (index < 1) {
                        severity = "high";
                    } else if (index < 3) {
                        severity = "medium";
                    } else {
                        severity = "low";
                    }
                    
                    return {
                        ...anomaly,
                        severity
                    };
                });

            // Create comments array from metric comments
            const comments = pageWithMetrics.metrics
                .filter(metric => metric.comment)
                .map(metric => ({
                    id: metric.id * 1000 + 1, // Generate unique comment ID
                    content: `<p>${metric.comment}</p>`,
                    timestamp: metric.created_at ? new Date(metric.created_at).toISOString() : "2024-01-15T10:30:00",
                    anomalyId: metric.id,
                    userId: "user123" // Default user ID
                }));

            // Create summaries array from metric summary_text
            const summaries = pageWithMetrics.metrics
                .filter(metric => metric.summary_text && metric.summary_text !== metric.comment)
                .map(metric => ({
                    id: metric.id * 2000 + 1, // Generate unique summary ID
                    content: metric.summary_text,
                    timestamp: metric.updated_at ? new Date(metric.updated_at).toISOString() : "2024-01-15T16:00:00",
                    anomalyId: metric.id,
                    userId: "user456" // Default user ID
                }));

            const response = {
                name: pageWithMetrics.page.name,
                date: formatDate(pageWithMetrics.page.date),
                summary: pageWithMetrics.page.opsgenie_summary + "\n" + pageWithMetrics.page.metrics_summary 
                    || "Network monitoring logs showing connection patterns and bandwidth utilization across the infrastructure.",
                anomalies: sortedAnomalies,
                comments: comments,
                summaries: summaries
            };
            
            res.status(200).json({
                success: true,
                response: response
            });
        } catch (error) {
            console.error('[PageController] Error getting page details:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Update state for a metric
     */
    async updateMetricState(req: Request, res: Response): Promise<void> {
        try {
            const metric_id = Number(req.params.metric_id);
            const state = this.getMetricStateFromStateForUpdate(req.body.state).toString();

            if (isNaN(metric_id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid metric ID"
                });
                return;
            }

            if (!state || !Object.values(MetricState).includes(state as MetricState)) {
                res.status(400).json({
                    success: false,
                    error: "State is required and must be one of: RESOLVED, UNRESOLVED, NOT_OUR_ISSUE, ACKNOWLEDGED"
                });
                return;
            }

            const result = await this.pageService.updateMetricState(metric_id, state);
            
            if (!result) {
                res.status(404).json({
                    success: false,
                    error: "Metric not found"
                });
                return;
            }
            
            res.status(200).json({
                success: true,
                message: "Metric state updated successfully",
                data: {
                    id: result.id,
                    state: result.state,
                    updated_at: result.updated_at
                }
            });
        } catch (error) {
            console.error('[PageController] Error updating metric state:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    private getMetricState(metricState: string | undefined): string {
        if (!metricState) return "unresolved";
        
        switch (metricState.toUpperCase()) {
            case MetricState.RESOLVED:
                return "resolved";
            case MetricState.UNRESOLVED:
                return "unresolved";
            case MetricState.NOT_OUR_ISSUE:
                return "not_our_issue";
            case MetricState.ACKNOWLEDGED:
                return "acknowledged";
            default:
                return "unresolved";
        }
    }

    private getMetricStateFromStateForUpdate(state: string): MetricState {
        if (!state) return MetricState.UNRESOLVED;
        
        switch (state.toUpperCase()) {
            case MetricState.RESOLVED:
                return MetricState.RESOLVED;
            case MetricState.UNRESOLVED:
                return MetricState.UNRESOLVED;
            case MetricState.NOT_OUR_ISSUE:
                return MetricState.NOT_OUR_ISSUE;
            case MetricState.ACKNOWLEDGED:
                return MetricState.ACKNOWLEDGED;
            default:
                throw new Error(`Invalid state: ${state}`);
        }
    }
} 