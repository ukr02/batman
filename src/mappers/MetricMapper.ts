import { Metric } from "../entities/Metric";
import { MetricDto, CreateMetricDto, UpdateMetricDto } from "../dto/MetricDto";

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
            criticalityScore: entity.criticalityScore
        };
    }

    static fromDtoToEntity(dto: CreateMetricDto): Partial<Metric> {
        return {
            metrics_config_id: dto.metrics_config_id,
            name: dto.name,
            date: dto.date,
            state: dto.state,
            image_url: dto.image_url,
            summary_text: dto.summary_text,
            comment: dto.comment,
            value: dto.value,
            criticalityScore: dto.criticalityScore
        };
    }

    static fromUpdateDtoToEntity(dto: UpdateMetricDto): Partial<Metric> {
        const entity: Partial<Metric> = {};
        if (dto.metrics_config_id !== undefined) entity.metrics_config_id = dto.metrics_config_id;
        if (dto.name !== undefined) entity.name = dto.name;
        if (dto.date !== undefined) entity.date = dto.date;
        if (dto.state !== undefined) entity.state = dto.state;
        if (dto.image_url !== undefined) entity.image_url = dto.image_url;
        if (dto.summary_text !== undefined) entity.summary_text = dto.summary_text;
        if (dto.comment !== undefined) entity.comment = dto.comment;
        if (dto.value !== undefined) entity.value = dto.value;
        if (dto.criticalityScore !== undefined) entity.criticalityScore = dto.criticalityScore;
        return entity;
    }
} 