import { Repository, EntityManager, In, Between } from 'typeorm';
import { Page } from '../entities/Page';
import { PageDto, CreatePageDto, UpdatePageDto } from '../dto/PageDto';
import { PageMapper } from '../mappers/PageMapper';

export interface IPageRepository {
    findAll(): Promise<PageDto[]>;
    findAllByParentId(parentId: number): Promise<PageDto[]>;
    findById(id: number): Promise<PageDto | null>;
    findByServiceId(serviceId: number): Promise<PageDto[]>;
    findByType(type: string): Promise<PageDto[]>;
    create(pageDto: CreatePageDto): Promise<PageDto>;
    update(id: number, pageDto: UpdatePageDto): Promise<PageDto | null>;
    delete(id: number): Promise<boolean>;
    count(): Promise<number>;
}

export class PageRepository implements IPageRepository {
    constructor(private readonly pageRepository: Repository<Page>) {}

    async findAll(): Promise<PageDto[]> {
        const pages = await this.pageRepository.find({
            order: { id: 'ASC' }
        });
        return pages.map((page) => PageMapper.fromEntityToDto(page));
    }

    async findAllByParentId(parentId: number): Promise<PageDto[]> {
        const pages = await this.pageRepository.find({
            where: { parent_id: parentId },
            order: { id: 'ASC' }
        });
        return pages.map((page) => PageMapper.fromEntityToDto(page));
    }

    async findById(id: number): Promise<PageDto | null> {
        const page = await this.pageRepository.findOneBy({ id });
        return page ? PageMapper.fromEntityToDto(page) : null;
    }

    async findByServiceId(serviceId: number): Promise<PageDto[]> {
        const pages = await this.pageRepository.find({
            where: { service_id: serviceId },
            order: { id: 'ASC' }
        });
        return pages.map((page) => PageMapper.fromEntityToDto(page));
    }

    async findByType(type: string): Promise<PageDto[]> {
        const pages = await this.pageRepository.find({
            where: { type },
            order: { id: 'ASC' }
        });
        return pages.map((page) => PageMapper.fromEntityToDto(page));
    }

    async create(pageDto: CreatePageDto): Promise<PageDto> {
        const page = this.pageRepository.create(PageMapper.fromDtoToEntity(pageDto));
        const savedPage = await this.pageRepository.save(page);
        return PageMapper.fromEntityToDto(savedPage);
    }

    async update(id: number, pageDto: UpdatePageDto): Promise<PageDto | null> {
        const updateResult = await this.pageRepository
            .createQueryBuilder()
            .update()
            .set(PageMapper.fromUpdateDtoToEntity(pageDto))
            .where("id = :id", { id })
            .returning("*")
            .execute();

        if (!updateResult.affected) {
            return null;
        }

        const updatedPage = updateResult.raw[0] as Page;
        return PageMapper.fromEntityToDto(updatedPage);
    }

    async delete(id: number): Promise<boolean> {
        const deleteResult = await this.pageRepository
            .createQueryBuilder()
            .delete()
            .where("id = :id", { id })
            .execute();

        return (deleteResult.affected ?? 0) > 0;
    }

    async count(): Promise<number> {
        return await this.pageRepository.count();
    }

    // Additional utility methods
    async findPagesByServiceIds(serviceIds: number[]): Promise<PageDto[]> {
        const pages = await this.pageRepository.find({
            where: { service_id: In(serviceIds) },
            order: { id: 'ASC' }
        });
        return pages.map((page) => PageMapper.fromEntityToDto(page));
    }

    async findPagesByTypes(types: string[]): Promise<PageDto[]> {
        const pages = await this.pageRepository.find({
            where: { type: In(types) },
            order: { id: 'ASC' }
        });
        return pages.map((page) => PageMapper.fromEntityToDto(page));
    }

    async findPagesWithDateRange(startDate: number, endDate: number): Promise<PageDto[]> {
        const pages = await this.pageRepository.find({
            where: { date: Between(startDate, endDate) },
            order: { date: 'DESC' }
        });
        return pages.map((page) => PageMapper.fromEntityToDto(page));
    }

    async bulkCreatePages(pageDtos: CreatePageDto[], manager?: EntityManager): Promise<PageDto[]> {
        const repository = manager?.getRepository(Page) ?? this.pageRepository;
        
        const pages = pageDtos.map(dto => repository.create(PageMapper.fromDtoToEntity(dto)));
        const savedPages = await repository.save(pages);
        
        return savedPages.map(page => PageMapper.fromEntityToDto(page));
    }
} 