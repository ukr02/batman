import { Metric } from "../entities/Metric";
import { MetricsConfig } from "../entities/MetricsConfig";
import { MetricDto, CreateMetricDto, UpdateMetricDto, MetricFilterDto } from "../dto/MetricDto";
import { MetricMapper } from "../mappers/MetricMapper";
import { pyClient } from "../clients/PyClient";
import { MetricRepository } from "../repositories/MetricRepository";
import { MetricsConfigRepository } from "../repositories/MetricsConfigRepository";

export class MetricService {
    constructor(
        private metricRepository: MetricRepository,
        private metricsConfigRepository: MetricsConfigRepository
    ) {}

    async generateMetricsForDate(date: number): Promise<{ success: boolean; results: Array<{ config_id: number; success: boolean; error?: string }> }> {
        try {
            const metricConfigs = await this.metricsConfigRepository.findAll();
            
            if (metricConfigs.length === 0) {
                return { success: false, results: [], error: "No metric configs found" };
            }

            console.log(`[MetricService] Generating metrics for ${metricConfigs.length} configs for date ${date}`);

            const promises = metricConfigs.map(async (config) => {
                try {
                    const success = await pyClient.genMetric(config.id, date);
                    return {
                        config_id: config.id,
                        success,
                        error: success ? undefined : "API call failed"
                    };
                } catch (error) {
                    return {
                        config_id: config.id,
                        success: false,
                        error: error instanceof Error ? error.message : "Unknown error"
                    };
                }
            });

            const results = await Promise.all(promises);
            const allSuccessful = results.every(result => result.success);
            
            console.log(`[MetricService] Metric generation completed. Success: ${allSuccessful}, Results:`, results);

            return { success: allSuccessful, results };

        } catch (error) {
            console.error('[MetricService] Error generating metrics:', error);
            return {
                success: false,
                results: [],
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    async generateMetricsForService(serviceId: number, date: number): Promise<{ success: boolean; results: Array<{ config_id: number; success: boolean; error?: string }> }> {
        try {
            const metricConfigs = await this.metricsConfigRepository.findByServiceId(serviceId);
            
            if (metricConfigs.length === 0) {
                return { success: false, results: [], error: `No metric configs found for service ${serviceId}` };
            }

            console.log(`[MetricService] Generating metrics for service ${serviceId}, ${metricConfigs.length} configs for date ${date}`);

            const promises = metricConfigs.map(async (config) => {
                try {
                    const success = await pyClient.genMetric(config.id, date);
                    return {
                        config_id: config.id,
                        success,
                        error: success ? undefined : "API call failed"
                    };
                } catch (error) {
                    return {
                        config_id: config.id,
                        success: false,
                        error: error instanceof Error ? error.message : "Unknown error"
                    };
                }
            });

            const results = await Promise.all(promises);
            const allSuccessful = results.every(result => result.success);
            
            console.log(`[MetricService] Metric generation for service ${serviceId} completed. Success: ${allSuccessful}, Results:`, results);

            return { success: allSuccessful, results };

        } catch (error) {
            console.error(`[MetricService] Error generating metrics for service ${serviceId}:`, error);
            return {
                success: false,
                results: [],
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }

    async findAll(filter?: MetricFilterDto): Promise<MetricDto[]> {
        const metrics = await this.metricRepository.findAll(filter);
        return metrics.map(MetricMapper.fromEntityToDto);
    }

    async findById(id: number): Promise<MetricDto | null> {
        const metric = await this.metricRepository.findById(id);
        return metric ? MetricMapper.fromEntityToDto(metric) : null;
    }

    async create(createMetricDto: CreateMetricDto): Promise<MetricDto> {
        const metric = await this.metricRepository.create(createMetricDto);
        return MetricMapper.fromEntityToDto(metric);
    }

    async update(id: number, updateMetricDto: UpdateMetricDto): Promise<MetricDto | null> {
        const metric = await this.metricRepository.update(id, updateMetricDto);
        return metric ? MetricMapper.fromEntityToDto(metric) : null;
    }

    async delete(id: number): Promise<boolean> {
        return await this.metricRepository.delete(id);
    }
} 