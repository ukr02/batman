import { Pool } from 'pg';
import { Service } from '../entities/Service';
import { CreateServiceDto, UpdateServiceDto, ServiceFilterDto } from '../dto/ServiceDto';

export class ServiceRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async findAll(filter?: ServiceFilterDto): Promise<Service[]> {
        try {
            let query = 'SELECT * FROM services';
            const values: any[] = [];
            let paramIndex = 1;

            if (filter?.service_name) {
                query += ` WHERE service_name ILIKE $${paramIndex}`;
                values.push(`%${filter.service_name}%`);
                paramIndex++;
            }

            query += ' ORDER BY created_at DESC';

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
            throw new Error(`Failed to fetch services: ${error}`);
        }
    }

    async findById(id: number): Promise<Service | null> {
        try {
            const query = 'SELECT * FROM services WHERE id = $1';
            const result = await this.pool.query(query, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToEntity(result.rows[0]);
        } catch (error) {
            throw new Error(`Failed to fetch service with id ${id}: ${error}`);
        }
    }

    async findByServiceName(serviceName: string): Promise<Service | null> {
        try {
            const query = 'SELECT * FROM services WHERE service_name = $1';
            const result = await this.pool.query(query, [serviceName]);
            
            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToEntity(result.rows[0]);
        } catch (error) {
            throw new Error(`Failed to fetch service with name ${serviceName}: ${error}`);
        }
    }

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        try {
            const query = `
                INSERT INTO services (service_name, created_at, updated_at)
                VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING *
            `;
            
            const result = await this.pool.query(query, [createServiceDto.service_name]);
            return this.mapRowToEntity(result.rows[0]);
        } catch (error) {
            if (error instanceof Error && error.message.includes('duplicate key')) {
                throw new Error(`Service with name '${createServiceDto.service_name}' already exists`);
            }
            throw new Error(`Failed to create service: ${error}`);
        }
    }

    async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service | null> {
        try {
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (updateServiceDto.service_name !== undefined) {
                updateFields.push(`service_name = $${paramIndex++}`);
                values.push(updateServiceDto.service_name);
            }

            // Always update the updated_at timestamp
            updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

            if (updateFields.length === 0) {
                // No fields to update, just return the existing record
                return await this.findById(id);
            }

            values.push(id);
            const query = `
                UPDATE services 
                SET ${updateFields.join(', ')}
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const result = await this.pool.query(query, values);
            
            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToEntity(result.rows[0]);
        } catch (error) {
            if (error instanceof Error && error.message.includes('duplicate key')) {
                throw new Error(`Service with name '${updateServiceDto.service_name}' already exists`);
            }
            throw new Error(`Failed to update service with id ${id}: ${error}`);
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const query = 'DELETE FROM services WHERE id = $1';
            const result = await this.pool.query(query, [id]);
            return result.rowCount ? result.rowCount > 0 : false;
        } catch (error) {
            throw new Error(`Failed to delete service with id ${id}: ${error}`);
        }
    }

    async count(filter?: ServiceFilterDto): Promise<number> {
        try {
            let query = 'SELECT COUNT(*) FROM services';
            const values: any[] = [];
            let paramIndex = 1;

            if (filter?.service_name) {
                query += ` WHERE service_name ILIKE $${paramIndex}`;
                values.push(`%${filter.service_name}%`);
            }

            const result = await this.pool.query(query, values);
            return parseInt(result.rows[0].count);
        } catch (error) {
            throw new Error(`Failed to count services: ${error}`);
        }
    }

    private mapRowToEntity(row: any): Service {
        const service = new Service();
        service.id = row.id;
        service.service_name = row.service_name;
        service.created_at = row.created_at ? new Date(row.created_at) : new Date();
        service.updated_at = row.updated_at ? new Date(row.updated_at) : new Date();
        return service;
    }

    private mapRowsToEntities(rows: any[]): Service[] {
        return rows.map(row => this.mapRowToEntity(row));
    }
} 