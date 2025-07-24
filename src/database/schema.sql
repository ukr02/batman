-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL
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
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE SET NULL
);

-- Create metrics_config table
CREATE TABLE IF NOT EXISTS metrics_config (
    id SERIAL PRIMARY KEY,
    promql_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    service_id INTEGER NOT NULL,
    aggregation VARCHAR(255),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
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
    FOREIGN KEY (metrics_config_id) REFERENCES metrics_config(id) ON DELETE CASCADE
);

-- Create action_items table
CREATE TABLE IF NOT EXISTS action_items (
    id SERIAL PRIMARY KEY,
    jira_link VARCHAR(255),
    metric_id INTEGER NOT NULL,
    FOREIGN KEY (metric_id) REFERENCES metrics(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_name ON services(service_name);
CREATE INDEX IF NOT EXISTS idx_pages_service_id ON pages(service_id);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_type ON pages(type);
CREATE INDEX IF NOT EXISTS idx_metrics_config_service_id ON metrics_config(service_id);
CREATE INDEX IF NOT EXISTS idx_metrics_config_promql_name ON metrics_config(promql_name);
CREATE INDEX IF NOT EXISTS idx_metrics_config_id ON metrics(metrics_config_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date);
CREATE INDEX IF NOT EXISTS idx_metrics_state ON metrics(state);
CREATE INDEX IF NOT EXISTS idx_metrics_criticality ON metrics(criticalityScore);
CREATE INDEX IF NOT EXISTS idx_action_items_metric_id ON action_items(metric_id);
