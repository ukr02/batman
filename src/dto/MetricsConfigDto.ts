export interface MetricsConfigDto {
    id: number;
    promql_name: string;
    name: string;
    description?: string;
    service_id: number;
    aggregation?: string;
}

export interface CreateMetricsConfigDto {
    promql_name: string;
    name: string;
    description?: string;
    service_id: number;
    aggregation?: string;
}

export interface UpdateMetricsConfigDto {
    promql_name?: string;
    name?: string;
    description?: string;
    service_id?: number;
    aggregation?: string;
}

export interface MetricsConfigFilterDto {
    service_id?: number;
    promql_name?: string;
    limit?: number;
    offset?: number;
} 