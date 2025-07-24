import { Metric, MetricState } from "../entities/Metric";
import { MetricDto, CreateMetricDto } from "../dto/MetricDto";

export class MetricMapper {
    static fromEntityToDto(entity: Metric): MetricDto {
        return {
            id: entity.id,
            metrics_config_id: entity.metrics_config_id,
            name: entity.name,
            date: entity.date,
            state: entity.state,
            image_url: entity.image_url,
            summary_text: entity.summary_text,
            comment: entity.comment,
            value: entity.value,
            criticalityScore: entity.criticalityScore,
            created_at: entity.created_at,
            updated_at: entity.updated_at
        };
    }

    static fromDtoToEntity(dto: CreateMetricDto): Partial<Metric> {
        return {
            metrics_config_id: dto.metrics_config_id,
            name: dto.name,
            date: dto.date,
            state: dto.state as MetricState,
            image_url: dto.image_url,
            summary_text: dto.summary_text,
            comment: dto.comment,
            value: dto.value,
            criticalityScore: dto.criticalityScore
        };
    }
} 