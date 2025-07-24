export enum AggregationType {
    SUM = 'SUM',
    AVERAGE = 'AVERAGE'
}

export interface MetricsConfigDto {
    id: number;
    promql_name: string;
    name: string;
    description?: string;
    service_id: number;
    aggregation?: AggregationType;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMetricsConfigDto {
    promql_name: string;
    name: string;
    description?: string;
    service_id: number;
    aggregation?: AggregationType;
}

export interface UpdateMetricsConfigDto {
    promql_name?: string;
    name?: string;
    description?: string;
    service_id?: number;
    aggregation?: AggregationType;
}

export interface MetricsConfigFilterDto {
    service_id?: number;
    promql_name?: string;
    limit?: number;
    offset?: number;
} 