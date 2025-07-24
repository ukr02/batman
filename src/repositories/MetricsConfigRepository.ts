import { Pool } from 'pg';
import { MetricsConfig } from '../entities/MetricsConfig';
import { CreateMetricsConfigDto, UpdateMetricsConfigDto } from '../dto/MetricsConfigDto';

export class MetricsConfigRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<MetricsConfig[]> {
    try {
      const query = 'SELECT * FROM metrics_config ORDER BY created_at DESC';
      const result = await this.pool.query(query);
      return this.mapRowsToEntities(result.rows);
    } catch (error) {
      throw new Error(`Failed to fetch metrics configs: ${error}`);
    }
  }

  async findById(id: number): Promise<MetricsConfig | null> {
    try {
      const query = 'SELECT * FROM metrics_config WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch metrics config with id ${id}: ${error}`);
    }
  }

  async findByServiceId(serviceId: number): Promise<MetricsConfig[]> {
    try {
      const query = 'SELECT * FROM metrics_config WHERE service_id = $1 ORDER BY created_at DESC';
      const result = await this.pool.query(query, [serviceId]);
      return this.mapRowsToEntities(result.rows);
    } catch (error) {
      throw new Error(`Failed to fetch metrics configs for service ${serviceId}: ${error}`);
    }
  }

  async findByPromqlName(promqlName: string): Promise<MetricsConfig | null> {
    try {
      const query = 'SELECT * FROM metrics_config WHERE promql_name = $1';
      const result = await this.pool.query(query, [promqlName]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch metrics config with promql_name ${promqlName}: ${error}`);
    }
  }

  async create(createMetricsConfigDto: CreateMetricsConfigDto): Promise<MetricsConfig> {
    try {
      const query = `
        INSERT INTO metrics_config (promql_name, name, description, service_id, aggregation, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      
      const values = [
        createMetricsConfigDto.promql_name,
        createMetricsConfigDto.name,
        createMetricsConfigDto.description,
        createMetricsConfigDto.service_id,
        createMetricsConfigDto.aggregation
      ];

      const result = await this.pool.query(query, values);
      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create metrics config: ${error}`);
    }
  }

  async update(id: number, updateMetricsConfigDto: UpdateMetricsConfigDto): Promise<MetricsConfig | null> {
    try {
      // Build dynamic query based on provided fields
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updateMetricsConfigDto.promql_name !== undefined) {
        updateFields.push(`promql_name = $${paramIndex++}`);
        values.push(updateMetricsConfigDto.promql_name);
      }

      if (updateMetricsConfigDto.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        values.push(updateMetricsConfigDto.name);
      }

      if (updateMetricsConfigDto.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        values.push(updateMetricsConfigDto.description);
      }

      if (updateMetricsConfigDto.service_id !== undefined) {
        updateFields.push(`service_id = $${paramIndex++}`);
        values.push(updateMetricsConfigDto.service_id);
      }

      if (updateMetricsConfigDto.aggregation !== undefined) {
        updateFields.push(`aggregation = $${paramIndex++}`);
        values.push(updateMetricsConfigDto.aggregation);
      }

      // Always update the updated_at timestamp
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updateFields.length === 0) {
        // No fields to update, just return the existing record
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE metrics_config 
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
      throw new Error(`Failed to update metrics config with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM metrics_config WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      throw new Error(`Failed to delete metrics config with id ${id}: ${error}`);
    }
  }

  private mapRowToEntity(row: any): MetricsConfig {
    const metricsConfig = new MetricsConfig();
    metricsConfig.id = row.id;
    metricsConfig.promql_name = row.promql_name;
    metricsConfig.name = row.name;
    metricsConfig.description = row.description;
    metricsConfig.service_id = row.service_id;
    metricsConfig.aggregation = row.aggregation;
    metricsConfig.created_at = row.created_at ? new Date(row.created_at) : new Date();
    metricsConfig.updated_at = row.updated_at ? new Date(row.updated_at) : new Date();
    return metricsConfig;
  }

  private mapRowsToEntities(rows: any[]): MetricsConfig[] {
    return rows.map(row => this.mapRowToEntity(row));
  }
} 