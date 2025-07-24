export interface ActionItemDto {
    id: number;
    jira_link?: string;
    metric_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateActionItemDto {
    jira_link?: string;
    metric_id: number;
}

export interface UpdateActionItemDto {
    jira_link?: string;
    metric_id?: number;
}

export interface ActionItemFilterDto {
    metric_id?: number;
    limit?: number;
    offset?: number;
} 