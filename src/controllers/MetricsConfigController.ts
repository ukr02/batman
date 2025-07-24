import { Request, Response } from "express";
import { MetricsConfigService } from "../services/MetricsConfigService";
import { CreateMetricsConfigDto, UpdateMetricsConfigDto, AggregationType } from "../dto/MetricsConfigDto";

export class MetricsConfigController {
    constructor(private metricsConfigService: MetricsConfigService) {}

    async getAllMetricsConfigs(req: Request, res: Response): Promise<void> {
        try {
            const metricsConfigs = await this.metricsConfigService.getAllMetricsConfigs();
            
            res.json({
                success: true,
                data: metricsConfigs,
                message: "Metrics configs retrieved successfully"
            });
        } catch (error) {
            console.error("Error getting metrics configs:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve metrics configs",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async getMetricsConfigById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid metrics config ID",
                    message: "Metrics config ID must be a valid number"
                });
                return;
            }

            const metricsConfig = await this.metricsConfigService.getMetricsConfigById(id);
            
            if (!metricsConfig) {
                res.status(404).json({
                    success: false,
                    error: "Metrics config not found",
                    message: `Metrics config with ID ${id} not found`
                });
                return;
            }

            res.json({
                success: true,
                data: metricsConfig,
                message: "Metrics config retrieved successfully"
            });
        } catch (error) {
            console.error("Error getting metrics config by ID:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve metrics config",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async getMetricsConfigsByServiceId(req: Request, res: Response): Promise<void> {
        try {
            const serviceId = parseInt(req.params.serviceId);
            
            if (isNaN(serviceId)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid service ID",
                    message: "Service ID must be a valid number"
                });
                return;
            }

            const metricsConfigs = await this.metricsConfigService.getMetricsConfigsByServiceId(serviceId);
            
            res.json({
                success: true,
                data: metricsConfigs,
                message: "Metrics configs retrieved successfully"
            });
        } catch (error) {
            console.error("Error getting metrics configs by service ID:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve metrics configs",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async createMetricsConfig(req: Request, res: Response): Promise<void> {
        try {
            const createMetricsConfigDto: CreateMetricsConfigDto = req.body;

            // Validate required fields
            if (!createMetricsConfigDto.promql_name || createMetricsConfigDto.promql_name.trim() === "") {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: "PromQL name is required"
                });
                return;
            }

            if (!createMetricsConfigDto.name || createMetricsConfigDto.name.trim() === "") {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: "Name is required"
                });
                return;
            }

            if (!createMetricsConfigDto.service_id || isNaN(createMetricsConfigDto.service_id)) {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: "Service ID is required and must be a valid number"
                });
                return;
            }

            // Validate aggregation enum if provided
            if (createMetricsConfigDto.aggregation && !Object.values(AggregationType).includes(createMetricsConfigDto.aggregation)) {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: `Aggregation must be one of: ${Object.values(AggregationType).join(', ')}`
                });
                return;
            }

            // Trim whitespace
            createMetricsConfigDto.promql_name = createMetricsConfigDto.promql_name.trim();
            createMetricsConfigDto.name = createMetricsConfigDto.name.trim();
            if (createMetricsConfigDto.description) {
                createMetricsConfigDto.description = createMetricsConfigDto.description.trim();
            }

            const metricsConfig = await this.metricsConfigService.createMetricsConfig(createMetricsConfigDto);
            
            res.status(201).json({
                success: true,
                data: metricsConfig,
                message: "Metrics config created successfully"
            });
        } catch (error) {
            console.error("Error creating metrics config:", error);
            
            if (error instanceof Error && error.message.includes("already exists")) {
                res.status(409).json({
                    success: false,
                    error: "Conflict",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Failed to create metrics config",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async updateMetricsConfig(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid metrics config ID",
                    message: "Metrics config ID must be a valid number"
                });
                return;
            }

            const updateMetricsConfigDto: UpdateMetricsConfigDto = req.body;

            // Validate that at least one field is provided
            if (!updateMetricsConfigDto.promql_name && 
                !updateMetricsConfigDto.name && 
                !updateMetricsConfigDto.description && 
                !updateMetricsConfigDto.service_id && 
                !updateMetricsConfigDto.aggregation) {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: "At least one field must be provided for update"
                });
                return;
            }

            // Validate aggregation enum if provided
            if (updateMetricsConfigDto.aggregation && !Object.values(AggregationType).includes(updateMetricsConfigDto.aggregation)) {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: `Aggregation must be one of: ${Object.values(AggregationType).join(', ')}`
                });
                return;
            }

            // Trim whitespace for string fields
            if (updateMetricsConfigDto.promql_name) {
                updateMetricsConfigDto.promql_name = updateMetricsConfigDto.promql_name.trim();
                if (updateMetricsConfigDto.promql_name === "") {
                    res.status(400).json({
                        success: false,
                        error: "Validation error",
                        message: "PromQL name cannot be empty"
                    });
                    return;
                }
            }

            if (updateMetricsConfigDto.name) {
                updateMetricsConfigDto.name = updateMetricsConfigDto.name.trim();
                if (updateMetricsConfigDto.name === "") {
                    res.status(400).json({
                        success: false,
                        error: "Validation error",
                        message: "Name cannot be empty"
                    });
                    return;
                }
            }

            if (updateMetricsConfigDto.description) {
                updateMetricsConfigDto.description = updateMetricsConfigDto.description.trim();
            }

            const metricsConfig = await this.metricsConfigService.updateMetricsConfig(id, updateMetricsConfigDto);
            
            if (!metricsConfig) {
                res.status(404).json({
                    success: false,
                    error: "Metrics config not found",
                    message: `Metrics config with ID ${id} not found`
                });
                return;
            }

            res.json({
                success: true,
                data: metricsConfig,
                message: "Metrics config updated successfully"
            });
        } catch (error) {
            console.error("Error updating metrics config:", error);
            
            if (error instanceof Error && error.message.includes("already exists")) {
                res.status(409).json({
                    success: false,
                    error: "Conflict",
                    message: error.message
                });
                return;
            }

            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    error: "Metrics config not found",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Failed to update metrics config",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async deleteMetricsConfig(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid metrics config ID",
                    message: "Metrics config ID must be a valid number"
                });
                return;
            }

            const deleted = await this.metricsConfigService.deleteMetricsConfig(id);
            
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: "Metrics config not found",
                    message: `Metrics config with ID ${id} not found`
                });
                return;
            }

            res.json({
                success: true,
                message: "Metrics config deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting metrics config:", error);
            
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    error: "Metrics config not found",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Failed to delete metrics config",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
} 