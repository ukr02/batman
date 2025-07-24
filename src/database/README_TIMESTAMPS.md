# Database Timestamps Implementation

This document describes the implementation of `created_at` and `updated_at` timestamp columns across all database tables.

## Overview

All tables now include automatic timestamp tracking:
- `created_at`: Set automatically when a record is created
- `updated_at`: Set automatically when a record is updated

## Tables with Timestamps

### 1. services
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

### 2. pages
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

### 3. metrics_config
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

### 4. metrics
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

### 5. action_items
- `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

## Database Triggers

Automatic `updated_at` updates are handled by PostgreSQL triggers:

```sql
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for each table
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metrics_config_updated_at BEFORE UPDATE ON metrics_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Indexes

Performance indexes have been added for timestamp columns:

```sql
-- Services
CREATE INDEX idx_services_created_at ON services(created_at);
CREATE INDEX idx_services_updated_at ON services(updated_at);

-- Pages
CREATE INDEX idx_pages_created_at ON pages(created_at);
CREATE INDEX idx_pages_updated_at ON pages(updated_at);

-- Metrics Config
CREATE INDEX idx_metrics_config_created_at ON metrics_config(created_at);
CREATE INDEX idx_metrics_config_updated_at ON metrics_config(updated_at);

-- Metrics
CREATE INDEX idx_metrics_created_at ON metrics(created_at);
CREATE INDEX idx_metrics_updated_at ON metrics(updated_at);

-- Action Items
CREATE INDEX idx_action_items_created_at ON action_items(created_at);
CREATE INDEX idx_action_items_updated_at ON action_items(updated_at);
```

## Entity Updates

All TypeORM entities have been updated to include timestamp columns:

```typescript
@Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
created_at!: Date;

@Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
updated_at!: Date;
```

## DTO Updates

All DTOs now include timestamp fields in their response interfaces:

```typescript
export interface PageDto {
    id: number;
    service_id: number;
    name: string;
    type: string;
    // ... other fields
    created_at: Date;
    updated_at: Date;
}
```

## Mapper Updates

All mappers have been updated to include timestamp fields in entity-to-DTO conversions:

```typescript
static fromEntityToDto(entity: Page): PageDto {
    return {
        id: entity.id,
        service_id: entity.service_id,
        name: entity.name,
        type: entity.type,
        // ... other fields
        created_at: entity.created_at,
        updated_at: entity.updated_at
    };
}
```

## Repository Updates

Repository queries now order by `created_at DESC` for better chronological ordering:

```typescript
const query = 'SELECT * FROM pages ORDER BY created_at DESC';
```

## Schema File

All timestamp changes are included in the main `src/database/schema.sql` file. This file contains:

1. **Table Definitions** with timestamp columns
2. **Indexes** for timestamp performance
3. **Triggers** for automatic `updated_at` updates
4. **Function** for timestamp management

To apply the schema:
```bash
psql -d your_database -f src/database/schema.sql
```

## API Response Format

API responses now include timestamp fields in ISO 8601 format:

```json
{
  "id": 123,
  "service_id": 1,
  "name": "DAILY_25-12-2023",
  "type": "DAILY",
  "date": 1703462400000,
  "created_at": "2023-12-25T00:00:00.000Z",
  "updated_at": "2023-12-25T00:00:00.000Z"
}
```

## Benefits

1. **Audit Trail**: Track when records were created and last modified
2. **Data Integrity**: Automatic timestamp management prevents manual errors
3. **Performance**: Indexed timestamp columns enable efficient date-based queries
4. **Consistency**: Standardized timestamp format across all tables
5. **Debugging**: Easier to track data changes and troubleshoot issues

## Usage Examples

### Query by creation date
```sql
SELECT * FROM pages WHERE created_at >= '2023-12-01' ORDER BY created_at DESC;
```

### Query by last update
```sql
SELECT * FROM metrics WHERE updated_at >= '2023-12-25' ORDER BY updated_at DESC;
```

### Recent activity
```sql
SELECT * FROM action_items ORDER BY created_at DESC LIMIT 10;
``` 