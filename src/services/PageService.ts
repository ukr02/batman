import { Page } from "../entities/Page";
import { CreatePageDto, PageFilterDto, PageDto } from "../dto/PageDto";
import { PageType } from "../entities/Page";
import { PageMapper } from "../mappers/PageMapper";
import { PageRepository } from "../repositories/PageRepository";
import { MetricService } from "./MetricService";
import { Metric } from "../entities/Metric";

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
     * Get pages by service ID in API format
     */
    async getPagesByServiceForAPI(serviceId: number): Promise<Array<{
        id: number;
        weekStart: string;
        weekEnd: string;
        title: string;
        weeklyFile: {
            id: number;
            name: string;
            date: string;
        };
        files: Array<{
            id: number;
            name: string;
            date: string;
        }>;
    }>> {
        const pages = await this.findByServiceId(serviceId);
        
        // Group pages by type
        const weeklyPages = pages.filter(page => page.type === 'WEEKLY');
        const dailyPages = pages.filter(page => page.type === 'DAILY');
        
        // If no weekly pages exist, create week structures based on daily pages
        if (weeklyPages.length === 0 && dailyPages.length > 0) {
            return this.createWeekStructuresFromDailyPages(dailyPages);
        }
        
        // If no daily pages exist, return empty array
        return [];
    }

    /**
     * Create week structures based on daily pages when no weekly pages exist
     */
    private createWeekStructuresFromDailyPages(dailyPages: PageDto[]): Array<{
        id: number;
        weekStart: string;
        weekEnd: string;
        title: string;
        weeklyFile: {
            id: number;
            name: string;
            date: string;
        };
        files: Array<{
            id: number;
            name: string;
            date: string;
        }>;
    }> {
        // Group daily pages by week (Monday to Sunday)
        const weekGroups = new Map<string, PageDto[]>();
        
        dailyPages.forEach(dailyPage => {
            if (!dailyPage.date) return;
            
            const dailyDate = new Date(dailyPage.date);
            // Find the Monday of this week
            const dayOfWeek = dailyDate.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday becomes Monday of next week
            const monday = new Date(dailyDate);
            monday.setDate(dailyDate.getDate() - daysToMonday);
            
            const weekKey = monday.toISOString().split('T')[0];
            
            if (!weekGroups.has(weekKey)) {
                weekGroups.set(weekKey, []);
            }
            weekGroups.get(weekKey)!.push(dailyPage);
        });
        
        // Convert week groups to the required format
        const weeks = Array.from(weekGroups.entries()).map(([weekStartStr, weekDailyPages], index) => {
            const weekStart = new Date(weekStartStr);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // Sunday
            
            const weekEndStr = weekEnd.toISOString().split('T')[0];
            
            // Convert daily pages to file format
            const files = weekDailyPages.map(dailyPage => {
                const dailyDate = new Date(dailyPage.date!);
                const fileDateStr = dailyDate.toISOString().split('T')[0];
                
                return {
                    id: dailyPage.id,
                    name: dailyPage.name, // Use original page name instead of date-based format
                    date: fileDateStr
                };
            });
            
            // Generate weekly file (using a generated ID since no weekly page exists)
            const weeklyFile = {
                id: 10000 + index, // Generated ID for non-existent weekly page
                name: `week_summary_${weekStartStr.replace(/-/g, '_')}-${weekEndStr.split('-').slice(1).join('-')}.log`,
                date: weekEndStr
            };
            
            return {
                id: 10000 + index, // Generated ID for the week structure
                weekStart: weekStartStr,
                weekEnd: weekEndStr,
                title: `Week ${index + 1} - ${weekStartStr.split('-').slice(1).join('/')}-${weekEndStr.split('-').slice(1).join('/')}`,
                weeklyFile: weeklyFile,
                files: files
            };
        });
        
        // Sort weeks by start date
        return weeks.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
    }

    /**
     * Get page by ID with all metrics compilation
     */
    async getPageWithMetrics(pageId: number): Promise<{
        page: PageDto;
        metrics: Metric[];
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