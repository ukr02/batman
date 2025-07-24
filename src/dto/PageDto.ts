import { PageType } from "../entities/Page";

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
    created_at: Date;
    updated_at: Date;
}

export interface CreatePageDto {
    type: PageType;
    date: string; // DD-MM-YYYY format
    svc_id: number; // service_id
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
    svc_id?: number; // service_id
    type?: PageType;
    limit?: number;
    offset?: number;
} 