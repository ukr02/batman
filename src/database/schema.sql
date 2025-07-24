-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    parent_id INTEGER,
    heading VARCHAR(255),
    date BIGINT,
    summary TEXT,
    annotations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create metrics_config table
CREATE TABLE IF NOT EXISTS metrics_config (
    id SERIAL PRIMARY KEY,
    promql_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    service_id INTEGER NOT NULL,
    aggregation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create metrics table
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    metrics_config_id INTEGER NOT NULL,
    name VARCHAR(100),
    date BIGINT,
    state VARCHAR(10),
    image_url TEXT,
    summary_text TEXT,
    comment TEXT,
    value FLOAT,
    criticalityScore INTEGER CHECK (criticalityScore >= 1 AND criticalityScore <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create action_items table
CREATE TABLE IF NOT EXISTS action_items (
    id SERIAL PRIMARY KEY,
    jira_link VARCHAR(255),
    metric_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_name ON services(service_name);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);
CREATE INDEX IF NOT EXISTS idx_services_updated_at ON services(updated_at);

CREATE INDEX IF NOT EXISTS idx_pages_service_id ON pages(service_id);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON pages(type);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at);

CREATE INDEX IF NOT EXISTS idx_metrics_config_service_id ON metrics_config(service_id);
CREATE INDEX IF NOT EXISTS idx_metrics_config_promql_name ON metrics_config(promql_name);
CREATE INDEX IF NOT EXISTS idx_metrics_config_created_at ON metrics_config(created_at);
CREATE INDEX IF NOT EXISTS idx_metrics_config_updated_at ON metrics_config(updated_at);

CREATE INDEX IF NOT EXISTS idx_metrics_config_id ON metrics(metrics_config_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date);
CREATE INDEX IF NOT EXISTS idx_metrics_state ON metrics(state);
CREATE INDEX IF NOT EXISTS idx_metrics_criticality ON metrics(criticalityScore);
CREATE INDEX IF NOT EXISTS idx_metrics_created_at ON metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_metrics_updated_at ON metrics(updated_at);

CREATE INDEX IF NOT EXISTS idx_action_items_metric_id ON action_items(metric_id);
CREATE INDEX IF NOT EXISTS idx_action_items_created_at ON action_items(created_at);
CREATE INDEX IF NOT EXISTS idx_action_items_updated_at ON action_items(updated_at);


