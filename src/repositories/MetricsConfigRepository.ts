import { Repository } from 'typeorm';
import { MetricsConfig } from '../entities/MetricsConfig';
import { CreateMetricsConfigDto, UpdateMetricsConfigDto } from '../dto/MetricsConfigDto';

export class MetricsConfigRepository {
  private repository: Repository<MetricsConfig>;

  constructor(repository: Repository<MetricsConfig>) {
    this.repository = repository;
  }

  async findAll(): Promise<MetricsConfig[]> {
    try {
      return await this.repository.find({
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new Error(`Failed to fetch metrics configs: ${error}`);
    }
  }

  async findById(id: number): Promise<MetricsConfig | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to fetch metrics config with id ${id}: ${error}`);
    }
  }

  async findByServiceId(serviceId: number): Promise<MetricsConfig[]> {
    try {
      return await this.repository.find({
        where: { service_id: serviceId },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new Error(`Failed to fetch metrics configs for service ${serviceId}: ${error}`);
    }
  }

  async findByPromqlName(promqlName: string): Promise<MetricsConfig | null> {
    try {
      return await this.repository.findOne({ where: { promql_name: promqlName } });
    } catch (error) {
      throw new Error(`Failed to fetch metrics config with promql_name ${promqlName}: ${error}`);
    }
  }

  async create(createMetricsConfigDto: CreateMetricsConfigDto): Promise<MetricsConfig> {
    try {
      const metricsConfig = this.repository.create({
        promql_name: createMetricsConfigDto.promql_name,
        name: createMetricsConfigDto.name,
        description: createMetricsConfigDto.description,
        service_id: createMetricsConfigDto.service_id,
        aggregation: createMetricsConfigDto.aggregation
      });
      return await this.repository.save(metricsConfig);
    } catch (error) {
      throw new Error(`Failed to create metrics config: ${error}`);
    }
  }

  async update(id: number, updateMetricsConfigDto: UpdateMetricsConfigDto): Promise<MetricsConfig | null> {
    try {
      const updateData: Partial<MetricsConfig> = {};

      if (updateMetricsConfigDto.promql_name !== undefined) {
        updateData.promql_name = updateMetricsConfigDto.promql_name;
      }

      if (updateMetricsConfigDto.name !== undefined) {
        updateData.name = updateMetricsConfigDto.name;
      }

      if (updateMetricsConfigDto.description !== undefined) {
        updateData.description = updateMetricsConfigDto.description;
      }

      if (updateMetricsConfigDto.service_id !== undefined) {
        updateData.service_id = updateMetricsConfigDto.service_id;
      }

      if (updateMetricsConfigDto.aggregation !== undefined) {
        updateData.aggregation = updateMetricsConfigDto.aggregation;
      }

      if (Object.keys(updateData).length === 0) {
        return await this.findById(id);
      }

      await this.repository.update(id, updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update metrics config with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      throw new Error(`Failed to delete metrics config with id ${id}: ${error}`);
    }
  }
} 