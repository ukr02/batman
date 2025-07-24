import { Page } from "../entities/Page";
import { PageDto, CreatePageDto } from "../dto/PageDto";
import { PageType } from "../entities/Page";

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
            annotations: entity.annotations,
            created_at: entity.created_at,
            updated_at: entity.updated_at
        };
    }

    static fromDtoToEntity(dto: CreatePageDto): Partial<Page> {
        const name = `${dto.type}_${dto.date}`;
        
        // Convert DD-MM-YYYY format to epoch (start of day in UTC)
        const dateParts = dto.date.split('-');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2], 10);
        
        // Create date in UTC at start of day (00:00:00)
        const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        const epoch = utcDate.getTime();
        
        return {
            service_id: dto.svc_id,
            name: name,
            type: dto.type,
            date: epoch
        };
    }
} 