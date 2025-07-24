import { Request, Response } from "express";
import { ServiceService } from "../services/ServiceService";
import { CreateServiceDto, UpdateServiceDto, ServiceFilterDto } from "../dto/ServiceDto";

export class ServiceController {
    constructor(private serviceService: ServiceService) {}

    async getAllServices(req: Request, res: Response): Promise<void> {
        try {
            const filter: ServiceFilterDto = {
                service_name: req.query.service_name as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
            };

            const servicesResponse = await this.serviceService.getAllServicesForAPI(filter);
            
            res.json({
                success: true,
                response: servicesResponse
            });
        } catch (error) {
            console.error("Error getting services:", error);
            res.status(500).json({
                success: false,
                response: {
                    message: "Error"
                }
            });
        }
    }

    async getServiceById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid service ID",
                    message: "Service ID must be a valid number"
                });
                return;
            }

            const service = await this.serviceService.getServiceById(id);
            
            if (!service) {
                res.status(404).json({
                    success: false,
                    error: "Service not found",
                    message: `Service with ID ${id} not found`
                });
                return;
            }

            res.json({
                success: true,
                data: service,
                message: "Service retrieved successfully"
            });
        } catch (error) {
            console.error("Error getting service by ID:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve service",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async createService(req: Request, res: Response): Promise<void> {
        try {
            const createServiceDto: CreateServiceDto = req.body;

            // Validate required fields
            if (!createServiceDto.service_name || createServiceDto.service_name.trim() === "") {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: "Service name is required"
                });
                return;
            }

            // Trim whitespace
            createServiceDto.service_name = createServiceDto.service_name.trim();

            const service = await this.serviceService.createService(createServiceDto);
            
            res.status(201).json({
                success: true,
                data: service,
                message: "Service created successfully"
            });
        } catch (error) {
            console.error("Error creating service:", error);
            
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
                error: "Failed to create service",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async updateService(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid service ID",
                    message: "Service ID must be a valid number"
                });
                return;
            }

            const updateServiceDto: UpdateServiceDto = req.body;

            // Validate that at least one field is provided
            if (!updateServiceDto.service_name) {
                res.status(400).json({
                    success: false,
                    error: "Validation error",
                    message: "At least one field must be provided for update"
                });
                return;
            }

            // Trim whitespace if service_name is provided
            if (updateServiceDto.service_name) {
                updateServiceDto.service_name = updateServiceDto.service_name.trim();
                
                if (updateServiceDto.service_name === "") {
                    res.status(400).json({
                        success: false,
                        error: "Validation error",
                        message: "Service name cannot be empty"
                    });
                    return;
                }
            }

            const service = await this.serviceService.updateService(id, updateServiceDto);
            
            if (!service) {
                res.status(404).json({
                    success: false,
                    error: "Service not found",
                    message: `Service with ID ${id} not found`
                });
                return;
            }

            res.json({
                success: true,
                data: service,
                message: "Service updated successfully"
            });
        } catch (error) {
            console.error("Error updating service:", error);
            
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
                    error: "Service not found",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Failed to update service",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async deleteService(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: "Invalid service ID",
                    message: "Service ID must be a valid number"
                });
                return;
            }

            const deleted = await this.serviceService.deleteService(id);
            
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: "Service not found",
                    message: `Service with ID ${id} not found`
                });
                return;
            }

            res.json({
                success: true,
                message: "Service deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting service:", error);
            
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({
                    success: false,
                    error: "Service not found",
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Failed to delete service",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
} 