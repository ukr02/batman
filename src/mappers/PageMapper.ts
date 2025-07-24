import { Page } from "../entities/Page";
import { PageDto, CreatePageDto, UpdatePageDto } from "../dto/PageDto";

export class PageMapper {
    static fromEntityToDto(entity: Page): PageDto {
        return {
            id: entity.id,
            service_id: entity.service_id,
            name: entity.name,
            type: entity.type,
            parent_id: entity.parent_id,
            heading: entity.heading,
            date: entity.date,
            summary: entity.summary,
            annotations: entity.annotations
        };
    }

    static fromDtoToEntity(dto: CreatePageDto): Partial<Page> {
        return {
            service_id: dto.service_id,
            name: dto.name,
            type: dto.type,
            parent_id: dto.parent_id,
            heading: dto.heading,
            date: dto.date,
            summary: dto.summary,
            annotations: dto.annotations
        };
    }

    static fromUpdateDtoToEntity(dto: UpdatePageDto): Partial<Page> {
        const entity: Partial<Page> = {};
        if (dto.service_id !== undefined) entity.service_id = dto.service_id;
        if (dto.name !== undefined) entity.name = dto.name;
        if (dto.type !== undefined) entity.type = dto.type;
        if (dto.parent_id !== undefined) entity.parent_id = dto.parent_id;
        if (dto.heading !== undefined) entity.heading = dto.heading;
        if (dto.date !== undefined) entity.date = dto.date;
        if (dto.summary !== undefined) entity.summary = dto.summary;
        if (dto.annotations !== undefined) entity.annotations = dto.annotations;
        return entity;
    }
} 