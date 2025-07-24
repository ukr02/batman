import { ActionItem } from "../entities/ActionItem";
import { ActionItemDto, CreateActionItemDto, UpdateActionItemDto } from "../dto/ActionItemDto";

export class ActionItemMapper {
    static fromEntityToDto(entity: ActionItem): ActionItemDto {
        return {
            id: entity.id,
            jira_link: entity.jira_link,
            metric_id: entity.metric_id
        };
    }

    static fromDtoToEntity(dto: CreateActionItemDto): Partial<ActionItem> {
        return {
            jira_link: dto.jira_link,
            metric_id: dto.metric_id
        };
    }

    static fromUpdateDtoToEntity(dto: UpdateActionItemDto): Partial<ActionItem> {
        const entity: Partial<ActionItem> = {};
        if (dto.jira_link !== undefined) entity.jira_link = dto.jira_link;
        if (dto.metric_id !== undefined) entity.metric_id = dto.metric_id;
        return entity;
    }
} 