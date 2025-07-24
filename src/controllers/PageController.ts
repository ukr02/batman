import { Request, Response } from "express";
import { PageService } from "../services/PageService";
import { CreatePageDto, PageFilterDto } from "../dto/PageDto";
import { PageType } from "../entities/Page";

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
} 