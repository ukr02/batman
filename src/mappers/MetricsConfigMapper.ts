import { MetricsConfig } from "../entities/MetricsConfig";
import { MetricsConfigDto, CreateMetricsConfigDto } from "../dto/MetricsConfigDto";

export class MetricsConfigMapper {
    static fromEntityToDto(entity: MetricsConfig): MetricsConfigDto {
        return {
            id: entity.id,
            promql_name: entity.promql_name,
            name: entity.name,
            description: entity.description,
            service_id: entity.service_id,
            aggregation: entity.aggregation,
            created_at: entity.created_at,
            updated_at: entity.updated_at
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
} 