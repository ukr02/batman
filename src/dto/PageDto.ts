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