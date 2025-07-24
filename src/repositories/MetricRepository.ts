import { Pool } from 'pg';
import { Metric } from '../entities/Metric';
import { CreateMetricDto, UpdateMetricDto, MetricFilterDto } from '../dto/MetricDto';

export class MetricRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(filter?: MetricFilterDto): Promise<Metric[]> {
    try {
      let query = 'SELECT * FROM metrics';
      const conditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (filter?.metrics_config_id) {
        conditions.push(`metrics_config_id = $${paramIndex}`);
        values.push(filter.metrics_config_id);
        paramIndex++;
      }

      if (filter?.state) {
        conditions.push(`state = $${paramIndex}`);
        values.push(filter.state);
        paramIndex++;
      }

      if (filter?.date_from) {
        conditions.push(`date >= $${paramIndex}`);
        values.push(filter.date_from);
        paramIndex++;
      }

      if (filter?.date_to) {
        conditions.push(`date <= $${paramIndex}`);
        values.push(filter.date_to);
        paramIndex++;
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
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
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch metrics: ${error}`);
    }
  }

  async findById(id: number): Promise<Metric | null> {
    try {
      const query = 'SELECT * FROM metrics WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch metric with id ${id}: ${error}`);
    }
  }

  async create(metricData: CreateMetricDto): Promise<Metric> {
    try {
      const query = `
        INSERT INTO metrics (metrics_config_id, name, date, state, image_url, summary_text, comment, value, criticalityScore) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *
      `;
      const values = [
        metricData.metrics_config_id,
        metricData.name,
        metricData.date,
        metricData.state,
        metricData.image_url,
        metricData.summary_text,
        metricData.comment,
        metricData.value,
        metricData.criticalityScore
      ];
      
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create metric: ${error}`);
    }
  }

  async update(id: number, metricData: UpdateMetricDto): Promise<Metric | null> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (metricData.metrics_config_id !== undefined) {
        updateFields.push(`metrics_config_id = $${paramIndex}`);
        values.push(metricData.metrics_config_id);
        paramIndex++;
      }

      if (metricData.name !== undefined) {
        updateFields.push(`name = $${paramIndex}`);
        values.push(metricData.name);
        paramIndex++;
      }

      if (metricData.date !== undefined) {
        updateFields.push(`date = $${paramIndex}`);
        values.push(metricData.date);
        paramIndex++;
      }

      if (metricData.state !== undefined) {
        updateFields.push(`state = $${paramIndex}`);
        values.push(metricData.state);
        paramIndex++;
      }

      if (metricData.image_url !== undefined) {
        updateFields.push(`image_url = $${paramIndex}`);
        values.push(metricData.image_url);
        paramIndex++;
      }

      if (metricData.summary_text !== undefined) {
        updateFields.push(`summary_text = $${paramIndex}`);
        values.push(metricData.summary_text);
        paramIndex++;
      }

      if (metricData.comment !== undefined) {
        updateFields.push(`comment = $${paramIndex}`);
        values.push(metricData.comment);
        paramIndex++;
      }

      if (metricData.value !== undefined) {
        updateFields.push(`value = $${paramIndex}`);
        values.push(metricData.value);
        paramIndex++;
      }

      if (metricData.criticalityScore !== undefined) {
        updateFields.push(`criticalityScore = $${paramIndex}`);
        values.push(metricData.criticalityScore);
        paramIndex++;
      }

      if (updateFields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE metrics 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;

      const result = await this.pool.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update metric with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM metrics WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rowCount !== 0;
    } catch (error) {
      throw new Error(`Failed to delete metric with id ${id}: ${error}`);
    }
  }

  async findByConfigIdsAndDate(configIds: number[], date: number): Promise<Metric[]> {
    try {
      if (configIds.length === 0) {
        return [];
      }

      const placeholders = configIds.map((_, index) => `$${index + 2}`).join(',');
      const query = `
        SELECT * FROM metrics 
        WHERE metrics_config_id IN (${placeholders}) 
        AND date = $1 
        ORDER BY created_at DESC
      `;
      
      const values = [date, ...configIds];
      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch metrics for config IDs and date: ${error}`);
    }
  }
} 