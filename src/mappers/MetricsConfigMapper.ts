import { MetricsConfig } from "../entities/MetricsConfig";
import { MetricsConfigDto, CreateMetricsConfigDto, UpdateMetricsConfigDto } from "../dto/MetricsConfigDto";

export class MetricsConfigMapper {
    static fromEntityToDto(entity: MetricsConfig): MetricsConfigDto {
        return {
            id: entity.id,
            promql_name: entity.promql_name,
            name: entity.name,
            description: entity.description,
            service_id: entity.service_id,
            aggregation: entity.aggregation
        };
    }

    static fromDtoToEntity(dto: CreateMetricsConfigDto): Partial<MetricsConfig> {
        return {
            promql_name: dto.promql_name,
            name: dto.name,
            description: dto.description,
            service_id: dto.service_id,
            aggregation: dto.aggregation
        };
    }

    static fromUpdateDtoToEntity(dto: UpdateMetricsConfigDto): Partial<MetricsConfig> {
        const entity: Partial<MetricsConfig> = {};
        if (dto.promql_name !== undefined) entity.promql_name = dto.promql_name;
        if (dto.name !== undefined) entity.name = dto.name;
        if (dto.description !== undefined) entity.description = dto.description;
        if (dto.service_id !== undefined) entity.service_id = dto.service_id;
        if (dto.aggregation !== undefined) entity.aggregation = dto.aggregation;
        return entity;
    }
} 