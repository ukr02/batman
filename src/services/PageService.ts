import { Page } from "../entities/Page";
import { CreatePageDto, PageFilterDto, PageDto } from "../dto/PageDto";
import { PageType } from "../entities/Page";
import { PageMapper } from "../mappers/PageMapper";
import { PageRepository } from "../repositories/PageRepository";
import { MetricService } from "./MetricService";

export class PageService {
    constructor(
        private pageRepository: PageRepository,
        private metricService: MetricService
    ) {}

    /**
     * Create a page and trigger metric generation for the corresponding service
     */
    async createPageAndGenerateMetrics(createPageDto: CreatePageDto): Promise<{
        page: PageDto;
        metricGeneration: {
            success: boolean;
            results: Array<{ config_id: number; success: boolean; error?: string }>;
            error?: string;
        };
    }> {
        try {
            console.log(`[PageService] Creating page for service ${createPageDto.svc_id} with type ${createPageDto.type}`);

            // Create the page
            const page = await this.pageRepository.create(createPageDto);
            const pageDto = PageMapper.fromEntityToDto(page);

            console.log(`[PageService] Page created successfully with ID: ${page.id}, name: ${page.name}`);

            // Convert date string to epoch for metric generation
            const dateParts = createPageDto.date.split('-');
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const year = parseInt(dateParts[2], 10);
            
            // Create date in IST (UTC+5:30) and get start of day
            const istDate = new Date(year, month, day, 0, 0, 0, 0);
            // Convert to UTC epoch (subtract 5:30 hours for IST to UTC)
            const epoch = istDate.getTime() - (5.5 * 60 * 60 * 1000);

            // Trigger metric generation for the service
            const metricGeneration = await this.metricService.generateMetricsForService(
                createPageDto.svc_id, 
                epoch
            );

            console.log(`[PageService] Metric generation triggered for service ${createPageDto.svc_id}`);

            return {
                page: pageDto,
                metricGeneration
            };

        } catch (error) {
            console.error('[PageService] Error creating page and generating metrics:', error);
            throw new Error(`Failed to create page and generate metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get pages by service ID
     */
    async findByServiceId(serviceId: number): Promise<PageDto[]> {
        const pages = await this.pageRepository.findByServiceId(serviceId);
        return pages.map(PageMapper.fromEntityToDto);
    }

    /**
     * Get pages hierarchy (WEEKLY as main, DAILY as children)
     */
    async getPagesHierarchy(serviceId: number): Promise<{
        weekly: Array<{ id: number; name: string; children: Array<{ id: number; name: string }> }>;
    }> {
        try {
            const allPages = await this.pageRepository.findByServiceId(serviceId);
            
            // Group pages by type
            const weeklyPages = allPages.filter(page => page.type === 'WEEKLY');
            const dailyPages = allPages.filter(page => page.type === 'DAILY');
            
            // Create hierarchy structure
            const hierarchy = weeklyPages.map(weeklyPage => {
                // For now, we'll include all daily pages as children
                // In a more sophisticated implementation, you might want to group by week
                const children = dailyPages.map(dailyPage => ({
                    id: dailyPage.id,
                    name: dailyPage.name
                }));
                
                return {
                    id: weeklyPage.id,
                    name: weeklyPage.name,
                    children
                };
            });
            
            return { weekly: hierarchy };
        } catch (error) {
            console.error('[PageService] Error getting pages hierarchy:', error);
            throw new Error(`Failed to get pages hierarchy: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get page by ID with all metrics compilation
     */
    async getPageWithMetrics(pageId: number): Promise<{
        page: PageDto;
        metrics: Array<{
            id: number;
            metrics_config_id: number;
            name?: string;
            date?: number;
            state?: string;
            image_url?: string;
            summary_text?: string;
            comment?: string;
            value?: number;
            criticalityScore?: number;
        }>;
    } | null> {
        try {
            const page = await this.pageRepository.findById(pageId);
            
            if (!page) {
                return null;
            }
            
            const pageDto = PageMapper.fromEntityToDto(page);
            
            // Get metrics for this page's service and date
            // Ensure page.date is not undefined
            if (page.date === undefined) {
                throw new Error(`Page ${pageId} has no date associated`);
            }
            
            const metrics = await this.metricService.findByServiceAndDate(page.service_id, page.date);
            
            return {
                page: pageDto,
                metrics
            };
        } catch (error) {
            console.error('[PageService] Error getting page with metrics:', error);
            throw new Error(`Failed to get page with metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all pages with optional filtering
     */
    async findAll(filter?: PageFilterDto): Promise<PageDto[]> {
        const pages = await this.pageRepository.findAll(filter);
        return pages.map(PageMapper.fromEntityToDto);
    }

    /**
     * Get page by ID
     */
    async findById(id: number): Promise<PageDto | null> {
        const page = await this.pageRepository.findById(id);
        return page ? PageMapper.fromEntityToDto(page) : null;
    }

    /**
     * Create a page (without metric generation)
     */
    async create(createPageDto: CreatePageDto): Promise<PageDto> {
        const page = await this.pageRepository.create(createPageDto);
        return PageMapper.fromEntityToDto(page);
    }
} 