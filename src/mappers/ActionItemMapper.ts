import { ActionItem } from "../entities/ActionItem";
import { ActionItemDto, CreateActionItemDto } from "../dto/ActionItemDto";

export class ActionItemMapper {
    static fromEntityToDto(entity: ActionItem): ActionItemDto {
        return {
            id: entity.id,
            jira_link: entity.jira_link,
            metric_id: entity.metric_id,
            created_at: entity.created_at,
            updated_at: entity.updated_at
        };
    }

    static fromDtoToEntity(dto: CreateActionItemDto): Partial<ActionItem> {
        return {
            jira_link: dto.jira_link,
            metric_id: dto.metric_id
        };
    }
} 