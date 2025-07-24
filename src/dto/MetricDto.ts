export interface MetricDto {
    id: number;
    metrics_config_id: number;
    name?: string;
    date?: number;
    state?: string;
    image_url?: string;
    summary_text?: string;
    comment?: string;
    value?: number;
    criticalityScore?: number;
}

export interface CreateMetricDto {
    metrics_config_id: number;
    name?: string;
    date?: number;
    state?: string;
    image_url?: string;
    summary_text?: string;
    comment?: string;
    value?: number;
    criticalityScore?: number;
}

export interface UpdateMetricDto {
    metrics_config_id?: number;
    name?: string;
    date?: number;
    state?: string;
    image_url?: string;
    summary_text?: string;
    comment?: string;
    value?: number;
    criticalityScore?: number;
}

export interface MetricFilterDto {
    metrics_config_id?: number;
    state?: string;
    date_from?: number;
    date_to?: number;
    limit?: number;
    offset?: number;
} 