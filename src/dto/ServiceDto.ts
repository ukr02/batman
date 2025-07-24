export interface ServiceDto {
    id: number;
    service_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateServiceDto {
    service_name: string;
}

export interface UpdateServiceDto {
    service_name?: string;
}

export interface ServiceFilterDto {
    service_name?: string;
    limit?: number;
    offset?: number;
} 