import { Repository } from 'typeorm';
import { Page } from '../entities/Page';
import { CreatePageDto, PageFilterDto } from '../dto/PageDto';
import { PageMapper } from '../mappers/PageMapper';

export class PageRepository {
  private repository: Repository<Page>;

  constructor(repository: Repository<Page>) {
    this.repository = repository;
  }

  // Helper method to convert date field from string to number
  private convertDateField(page: Page): Page {
    return {
      ...page,
      date: page.date ? Number(page.date) : undefined
    };
  }

  // Helper method to convert date fields for arrays
  private convertDateFields(pages: Page[]): Page[] {
    return pages.map(page => this.convertDateField(page));
  }

  async findAll(filter?: PageFilterDto): Promise<Page[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('page');

      if (filter?.svc_id) {
        queryBuilder.andWhere('page.service_id = :serviceId', { serviceId: filter.svc_id });
      }

      if (filter?.type) {
        queryBuilder.andWhere('page.type = :type', { type: filter.type });
      }

      queryBuilder.orderBy('page.id', 'DESC');

      if (filter?.limit) {
        queryBuilder.limit(filter.limit);
      }

      if (filter?.offset) {
        queryBuilder.offset(filter.offset);
      }

      const pages = await queryBuilder.getMany();
      
      return this.convertDateFields(pages);
    } catch (error) {
      throw new Error(`Failed to fetch pages: ${error}`);
    }
  }

  async findById(id: number): Promise<Page | null> {
    try {
      const page = await this.repository.findOne({ where: { id } });
      
      if (!page) {
        return null;
      }
      
      return this.convertDateField(page);
    } catch (error) {
      throw new Error(`Failed to fetch page with id ${id}: ${error}`);
    }
  }

  async findByServiceId(serviceId: number): Promise<Page[]> {
    try {
      const pages = await this.repository.find({
        where: { service_id: serviceId },
        order: { id: 'DESC' }
      });
      
      return this.convertDateFields(pages);
    } catch (error) {
      throw new Error(`Failed to fetch pages for service ${serviceId}: ${error}`);
    }
  }

  async create(createPageDto: CreatePageDto): Promise<Page> {
    try {
      const entity = PageMapper.fromDtoToEntity(createPageDto);
      const savedPage = await this.repository.save(entity);
      return this.convertDateField(savedPage);
    } catch (error) {
      throw new Error(`Failed to create page: ${error}`);
    }
  }

  async getServices(): Promise<Array<{ service_id: number; service_name: string }>> {
    try {
      const result = await this.repository
        .createQueryBuilder('page')
        .select('DISTINCT service.id', 'service_id')
        .addSelect('service.service_name', 'service_name')
        .innerJoin('services', 'service', 'service.id = page.service_id')
        .orderBy('service.service_name', 'ASC')
        .getRawMany();
      
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error}`);
    }
  }
} 