import { Pool } from 'pg';
import { Page } from '../entities/Page';
import { CreatePageDto, PageFilterDto } from '../dto/PageDto';
import { PageMapper } from '../mappers/PageMapper';

export class PageRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(filter?: PageFilterDto): Promise<Page[]> {
    try {
      let query = 'SELECT * FROM pages';
      const conditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (filter?.svc_id) {
        conditions.push(`service_id = $${paramIndex}`);
        values.push(filter.svc_id);
        paramIndex++;
      }

      if (filter?.type) {
        conditions.push(`type = $${paramIndex}`);
        values.push(filter.type);
        paramIndex++;
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY id DESC';

      if (filter?.limit) {
        query += ` LIMIT $${paramIndex}`;
        values.push(filter.limit);
        paramIndex++;
      }

      if (filter?.offset) {
        query += ` OFFSET $${paramIndex}`;
        values.push(filter.offset);
      }

      const result = await this.pool.query(query, values);
      return this.mapRowsToEntities(result.rows);
    } catch (error) {
      throw new Error(`Failed to fetch pages: ${error}`);
    }
  }

  async findById(id: number): Promise<Page | null> {
    try {
      const query = 'SELECT * FROM pages WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch page with id ${id}: ${error}`);
    }
  }

  async findByServiceId(serviceId: number): Promise<Page[]> {
    try {
      const query = 'SELECT * FROM pages WHERE service_id = $1 ORDER BY id DESC';
      const result = await this.pool.query(query, [serviceId]);
      return this.mapRowsToEntities(result.rows);
    } catch (error) {
      throw new Error(`Failed to fetch pages for service ${serviceId}: ${error}`);
    }
  }

  async create(pageData: CreatePageDto): Promise<Page> {
    try {
      const entity = PageMapper.fromDtoToEntity(pageData);
      
      const query = `
        INSERT INTO pages (service_id, name, type, date) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `;
      const values = [
        entity.service_id,
        entity.name,
        entity.type,
        entity.date
      ];
      
      const result = await this.pool.query(query, values);
      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create page: ${error}`);
    }
  }

  async getServices(): Promise<Array<{ service_id: number; service_name: string }>> {
    try {
      const query = `
        SELECT DISTINCT s.id as service_id, s.service_name 
        FROM services s 
        INNER JOIN pages p ON s.id = p.service_id 
        ORDER BY s.service_name
      `;
      
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error}`);
    }
  }

  private mapRowToEntity(row: any): Page {
    const page = new Page();
    page.id = row.id;
    page.service_id = row.service_id;
    page.name = row.name;
    page.type = row.type;
    page.parent_id = row.parent_id;
    page.heading = row.heading;
    // Ensure date is properly converted to number (epoch)
    page.date = row.date ? Number(row.date) : undefined;
    page.summary = row.summary;
    page.annotations = row.annotations;
    page.created_at = row.created_at;
    page.updated_at = row.updated_at;
    return page;
  }

  private mapRowsToEntities(rows: any[]): Page[] {
    return rows.map(row => this.mapRowToEntity(row));
  }
} 