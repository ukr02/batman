import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("pages")
@Index(["service_id"])
@Index(["parent_id"])
@Index(["type"])
export class Page {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "integer", nullable: false })
    service_id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    type!: string;

    @Column({ type: "integer", nullable: true })
    parent_id?: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    heading?: string;

    @Column({ type: "bigint", nullable: true })
    date?: number;

    @Column({ type: "text", nullable: true })
    summary?: string;

    @Column({ type: "text", nullable: true })
    annotations?: string;
}

// DTOs for API requests/responses
export interface PageDto {
    id: number;
    service_id: number;
    name: string;
    type: string;
    parent_id?: number;
    heading?: string;
    date?: number;
    summary?: string;
    annotations?: string;
}

export interface CreatePageDto {
    service_id: number;
    name: string;
    type: string;
    parent_id?: number;
    heading?: string;
    date?: number;
    summary?: string;
    annotations?: string;
}

export interface UpdatePageDto {
    service_id?: number;
    name?: string;
    type?: string;
    parent_id?: number;
    heading?: string;
    date?: number;
    summary?: string;
    annotations?: string;
}

export interface PageFilterDto {
    service_id?: number;
    type?: string;
    parent_id?: number;
    limit?: number;
    offset?: number;
}

// Mapper for entity-DTO conversion
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