import { Request, Response } from "express";
import { MetricService } from "../services/MetricService";
import { MetricDto, CreateMetricDto, UpdateMetricDto, MetricFilterDto } from "../dto/MetricDto";

export class MetricController {
    constructor(private metricService: MetricService) {}

    /**
     * Trigger metric generation for all configs for a specific date
     */
    async generateMetricsForDate(req: Request, res: Response): Promise<void> {
        try {
            const { date } = req.body;
            
            if (!date || typeof date !== 'number') {
                res.status(400).json({
                    success: false,
                    error: "Date is required and must be a number"
                });
                return;
            }

            const result = await this.metricService.generateMetricsForDate(date);
            
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: "Metric generation triggered successfully",
                    results: result.results
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error || "Failed to generate metrics",
                    results: result.results
                });
            }
        } catch (error) {
            console.error('[MetricController] Error generating metrics for date:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Trigger metric generation for a specific service and date
     */
    async generateMetricsForService(req: Request, res: Response): Promise<void> {
        try {
            const { serviceId, date } = req.body;
            
            if (!serviceId || typeof serviceId !== 'number') {
                res.status(400).json({
                    success: false,
                    error: "Service ID is required and must be a number"
                });
                return;
            }

            if (!date || typeof date !== 'number') {
                res.status(400).json({
                    success: false,
                    error: "Date is required and must be a number"
                });
                return;
            }

            const result = await this.metricService.generateMetricsForService(serviceId, date);
            
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: "Metric generation triggered successfully",
                    results: result.results
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error || "Failed to generate metrics",
                    results: result.results
                });
            }
        } catch (error) {
            console.error('[MetricController] Error generating metrics for service:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Generate metric summary for a specific page
     */
    async generateMetricSummary(req: Request, res: Response): Promise<void> {
        try {
            const { service_name, date, page_id } = req.body;
            
            if (!page_id || typeof page_id !== 'number') {
                res.status(400).json({
                    success: false,
                    error: "page_id is required and must be a number"
                });
                return;
            }

            const result = await this.metricService.generateMetricSummaryForPage(page_id);
            
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: "Metric summary generation triggered successfully",
                    results: result.results
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error || "Failed to generate metric summary",
                    results: result.results
                });
            }
        } catch (error) {
            console.error('[MetricController] Error generating metric summary:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Generate opsgenie summary for a specific page
     */
    async generateOpsgenieSummary(req: Request, res: Response): Promise<void> {
        try {
            const { page_id, team_id, team_name, start_date, end_date } = req.body;
            
            if (!page_id || typeof page_id !== 'number') {
                res.status(400).json({
                    success: false,
                    error: "page_id is required and must be a number"
                });
                return;
            }

            const result = await this.metricService.generateOpsgenieSummaryForPage(page_id);
            
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: "Opsgenie summary generation triggered successfully",
                    results: result.results
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error || "Failed to generate opsgenie summary",
                    results: result.results
                });
            }
        } catch (error) {
            console.error('[MetricController] Error generating opsgenie summary:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Get all metrics with optional filtering
     */
    async getAllMetrics(req: Request, res: Response): Promise<void> {
        try {
            const filter: MetricFilterDto = {
                metrics_config_id: req.query.metrics_config_id ? Number(req.query.metrics_config_id) : undefined,
                state: req.query.state as string,
                date_from: req.query.date_from ? Number(req.query.date_from) : undefined,
                date_to: req.query.date_to ? Number(req.query.date_to) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                offset: req.query.offset ? Number(req.query.offset) : undefined
            };

            const metrics = await this.metricService.findAll(filter);
            
            res.status(200).json({
                success: true,
                data: metrics,
                count: metrics.length
            });
        } catch (error) {
            console.error('[MetricController] Error getting metrics:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Get metric by ID
     */
    async getMetricById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid metric ID"
                });
                return;
            }

            const metric = await this.metricService.findById(id);
            
            if (!metric) {
                res.status(404).json({
                    success: false,
                    error: "Metric not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: metric
            });
        } catch (error) {
            console.error('[MetricController] Error getting metric by ID:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Create a new metric
     */
    async createMetric(req: Request, res: Response): Promise<void> {
        try {
            const createMetricDto: CreateMetricDto = req.body;
            
            // Validate required fields
            if (!createMetricDto.metrics_config_id) {
                res.status(400).json({
                    success: false,
                    error: "metrics_config_id is required"
                });
                return;
            }

            const metric = await this.metricService.create(createMetricDto);
            
            res.status(201).json({
                success: true,
                data: metric,
                message: "Metric created successfully"
            });
        } catch (error) {
            console.error('[MetricController] Error creating metric:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Update a metric
     */
    async updateMetric(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const updateMetricDto: UpdateMetricDto = req.body;
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid metric ID"
                });
                return;
            }

            const metric = await this.metricService.update(id, updateMetricDto);
            
            if (!metric) {
                res.status(404).json({
                    success: false,
                    error: "Metric not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: metric,
                message: "Metric updated successfully"
            });
        } catch (error) {
            console.error('[MetricController] Error updating metric:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

    /**
     * Delete a metric
     */
    async deleteMetric(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid metric ID"
                });
                return;
            }

            const deleted = await this.metricService.delete(id);
            
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: "Metric not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Metric deleted successfully"
            });
        } catch (error) {
            console.error('[MetricController] Error deleting metric:', error);
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }
} 