import { Request, Response } from "express";
import { PageService } from "../services/PageService";
import { CreatePageDto, PageFilterDto } from "../dto/PageDto";
import { PageType } from "../entities/Page";
import { MetricState } from "../entities/Metric";

export class PageController {
    constructor(private pageService: PageService) {}

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
            
            res.status(200).json({
                success: true,
                data: pageWithMetrics
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

            // Map metrics to anomalies
            const anomalies = pageWithMetrics.metrics.map(metric => ({
                id: metric.id,
                title: metric.name || `Metric ${metric.id}`,
                severity: metric.criticalityScore && metric.criticalityScore > 7 ? "high" : 
                         metric.criticalityScore && metric.criticalityScore > 4 ? "medium" : "low",
                description: metric.summary_text || `Anomaly detected in ${metric.name || 'metric'}`,
                graphImage: metric.image_url || "/anomaly_detection_plot.png",
                state: this.getMetricState(metric.state) || "unresolved"
            }));

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
                summary: pageWithMetrics.page.summary || "Network monitoring logs showing connection patterns and bandwidth utilization across the infrastructure.",
                anomalies: anomalies,
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