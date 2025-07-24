import { MetricsConfigRepository } from "../repositories/MetricsConfigRepository";
import { CreateMetricsConfigDto, UpdateMetricsConfigDto, MetricsConfigFilterDto, MetricsConfigDto, AggregationType } from "../dto/MetricsConfigDto";
import { MetricsConfig } from "../entities/MetricsConfig";

export class MetricsConfigService {
    constructor(private metricsConfigRepository: MetricsConfigRepository) {}

    async getAllMetricsConfigs(): Promise<MetricsConfigDto[]> {
        const metricsConfigs = await this.metricsConfigRepository.findAll();
        return metricsConfigs.map(this.mapToDto);
    }

    async getMetricsConfigById(id: number): Promise<MetricsConfigDto | null> {
        const metricsConfig = await this.metricsConfigRepository.findById(id);
        return metricsConfig ? this.mapToDto(metricsConfig) : null;
    }

    async getMetricsConfigsByServiceId(serviceId: number): Promise<MetricsConfigDto[]> {
        const metricsConfigs = await this.metricsConfigRepository.findByServiceId(serviceId);
        return metricsConfigs.map(this.mapToDto);
    }

    async getMetricsConfigByPromqlName(promqlName: string): Promise<MetricsConfigDto | null> {
        const metricsConfig = await this.metricsConfigRepository.findByPromqlName(promqlName);
        return metricsConfig ? this.mapToDto(metricsConfig) : null;
    }

    async createMetricsConfig(createMetricsConfigDto: CreateMetricsConfigDto): Promise<MetricsConfigDto> {
        // Check if metrics config with same promql_name already exists
        const existingConfig = await this.metricsConfigRepository.findByPromqlName(createMetricsConfigDto.promql_name);
        if (existingConfig) {
            throw new Error(`Metrics config with promql_name '${createMetricsConfigDto.promql_name}' already exists`);
        }

        const metricsConfig = await this.metricsConfigRepository.create(createMetricsConfigDto);
        return this.mapToDto(metricsConfig);
    }

    async updateMetricsConfig(id: number, updateMetricsConfigDto: UpdateMetricsConfigDto): Promise<MetricsConfigDto | null> {
        // Check if metrics config exists
        const existingConfig = await this.metricsConfigRepository.findById(id);
        if (!existingConfig) {
            throw new Error(`Metrics config with id ${id} not found`);
        }

        // If updating promql_name, check if new name already exists
        if (updateMetricsConfigDto.promql_name && updateMetricsConfigDto.promql_name !== existingConfig.promql_name) {
            const configWithSamePromqlName = await this.metricsConfigRepository.findByPromqlName(updateMetricsConfigDto.promql_name);
            if (configWithSamePromqlName) {
                throw new Error(`Metrics config with promql_name '${updateMetricsConfigDto.promql_name}' already exists`);
            }
        }

        const updatedConfig = await this.metricsConfigRepository.update(id, updateMetricsConfigDto);
        return updatedConfig ? this.mapToDto(updatedConfig) : null;
    }

    async deleteMetricsConfig(id: number): Promise<boolean> {
        // Check if metrics config exists
        const existingConfig = await this.metricsConfigRepository.findById(id);
        if (!existingConfig) {
            throw new Error(`Metrics config with id ${id} not found`);
        }

        return await this.metricsConfigRepository.delete(id);
    }

    private mapToDto(metricsConfig: MetricsConfig): MetricsConfigDto {
        return {
            id: metricsConfig.id,
            promql_name: metricsConfig.promql_name,
            name: metricsConfig.name,
            description: metricsConfig.description,
            service_id: metricsConfig.service_id,
            aggregation: metricsConfig.aggregation,
            created_at: metricsConfig.created_at,
            updated_at: metricsConfig.updated_at
        };
    }
} 