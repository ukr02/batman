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
        
        // Convert DD-MM-YYYY format to epoch (start of IST date)
        const dateParts = dto.date.split('-');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2], 10);
        
        // Create date in IST (UTC+5:30) and get start of day
        const istDate = new Date(year, month, day, 0, 0, 0, 0);
        // Convert to UTC epoch (subtract 5:30 hours for IST to UTC)
        const epoch = istDate.getTime() - (5.5 * 60 * 60 * 1000);
        
        return {
            service_id: dto.svc_id,
            name: name,
            type: dto.type,
            date: epoch
        };
    }
} 