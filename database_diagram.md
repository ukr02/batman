# Database Schema Diagram

## Mermaid ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    services {
        int id PK
        varchar service_name
    }
    
    pages {
        int id PK
        int service_id FK
        varchar name
        int parent_id FK
        varchar heading
        bigint date
        text summary
        text annotations
    }
    
    anomalies {
        int id PK
        int page_id FK
        varchar image_url
        text summary_text
        text comment
        int anomaly_id
    }
    
    action_items {
        int id PK
        varchar jira_link
        int anomaly_id FK
        int service_id FK
    }
    
    metrics_config {
        int id PK
        varchar promql_name
        varchar name
        text description
        int service_id FK
        varchar aggregation
    }
    
    metrics {
        int id PK
        int service_id FK
        int metrics_config_id FK
        bigint date
        float value
    }
    
    %% Relationships
    services ||--o{ pages : "has"
    services ||--o{ action_items : "has"
    services ||--o{ metrics_config : "has"
    services ||--o{ metrics : "has"
    
    pages ||--o{ pages : "parent_child"
    pages ||--o{ anomalies : "has"
    
    anomalies ||--o{ action_items : "triggers"
    
    metrics_config ||--o{ metrics : "defines"
```

## Alternative: PlantUML Database Diagram

```plantuml
@startuml Database Schema

!define table(x) class x << (T,#FFAAAA) >>
!define primary_key(x) <u>x</u>
!define foreign_key(x) <i>x</i>

table(services) {
  primary_key(id) : INT
  service_name : VARCHAR(255)
}

table(pages) {
  primary_key(id) : INT
  foreign_key(service_id) : INT
  name : VARCHAR(255)
  foreign_key(parent_id) : INT
  heading : VARCHAR(255)
  date : BIGINT
  summary : TEXT
  annotations : TEXT
}

table(anomalies) {
  primary_key(id) : INT
  foreign_key(page_id) : INT
  image_url : VARCHAR(255)
  summary_text : TEXT
  comment : TEXT
  anomaly_id : INT
}

table(action_items) {
  primary_key(id) : INT
  jira_link : VARCHAR(255)
  foreign_key(anomaly_id) : INT
  foreign_key(service_id) : INT
}

table(metrics_config) {
  primary_key(id) : INT
  promql_name : VARCHAR(255)
  name : VARCHAR(255)
  description : TEXT
  foreign_key(service_id) : INT
  aggregation : VARCHAR(255)
}

table(metrics) {
  primary_key(id) : INT
  foreign_key(service_id) : INT
  foreign_key(metrics_config_id) : INT
  date : BIGINT
  value : FLOAT
}

' Relationships
services ||--o{ pages : "has"
services ||--o{ action_items : "has"
services ||--o{ metrics_config : "has"
services ||--o{ metrics : "has"

pages ||--o{ pages : "parent_child"
pages ||--o{ anomalies : "has"

anomalies ||--o{ action_items : "triggers"

metrics_config ||--o{ metrics : "defines"

@enduml
```

## How to Visualize

### Option 1: Mermaid Live Editor
1. Go to [Mermaid Live Editor](https://mermaid.live/)
2. Copy the Mermaid code (between the ```mermaid tags)
3. Paste it in the editor
4. The diagram will render automatically

### Option 2: GitHub
1. Create a new markdown file in your GitHub repository
2. Copy the Mermaid code
3. GitHub will automatically render the diagram

### Option 3: PlantUML Online
1. Go to [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. Copy the PlantUML code (between @startuml and @enduml)
3. Paste and view the diagram

### Option 4: Draw.io (diagrams.net)
1. Go to [draw.io](https://app.diagrams.net/)
2. Create a new diagram
3. Use the database template to manually recreate the schema

## Database Schema Summary

This schema represents a monitoring/observability system with:

- **Services**: The main entities being monitored
- **Pages**: Hierarchical pages associated with services
- **Anomalies**: Issues detected on pages
- **Action Items**: JIRA tickets linked to anomalies
- **Metrics Config**: Configuration for different metrics
- **Metrics**: Actual metric values over time

The relationships show a typical monitoring system where services have pages, pages can have anomalies, anomalies trigger action items, and metrics are collected based on configurations. 