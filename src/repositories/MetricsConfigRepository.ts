import { Pool } from 'pg';
import { MetricsConfig } from '../entities/MetricsConfig';

export class MetricsConfigRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<MetricsConfig[]> {
    try {
      const query = 'SELECT * FROM metrics_config ORDER BY id';
      const result = await this.pool.query(query);
      return result.rows;
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

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch metrics config with id ${id}: ${error}`);
    }
  }

  async findByServiceId(serviceId: number): Promise<MetricsConfig[]> {
    try {
      const query = 'SELECT * FROM metrics_config WHERE service_id = $1 ORDER BY id';
      const result = await this.pool.query(query, [serviceId]);
      return result.rows;
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

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch metrics config with promql_name ${promqlName}: ${error}`);
    }
  }
} 