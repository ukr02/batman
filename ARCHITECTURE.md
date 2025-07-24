# Architecture Documentation

## Overview

This application follows a clean layered architecture pattern with clear separation of concerns. The codebase is organized into distinct layers, each with specific responsibilities.

## Directory Structure

```
src/
├── app/                    # Application initialization
│   └── app.ts             # Express app setup and middleware
├── controllers/            # HTTP request/response handlers
│   ├── UserController.ts
│   └── ProductController.ts
├── services/              # Business logic layer
│   ├── UserService.ts
│   └── ProductService.ts
├── repositories/          # Data access layer
│   ├── UserRepository.ts
│   └── ProductRepository.ts
├── entities/              # Data models and validation
│   ├── User.ts
│   └── Product.ts
├── database/              # Database management
│   ├── connection/        # Database connection management
│   │   └── connection.ts  # Database connection configuration
│   ├── manager.ts         # Database manager wrapper
│   ├── init.ts           # Database initialization
│   └── schema.sql        # Database schema
├── routes/                # Express routes
│   ├── userRoutes.ts
│   └── productRoutes.ts
├── server.ts              # Server entry point
└── index.ts              # Main exports
```

## Layer Responsibilities

### 1. Controllers Layer (`/controllers`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Parse request parameters and body
  - Validate input data
  - Call appropriate service methods
  - Format and send HTTP responses
  - Handle HTTP-specific errors

### 2. Services Layer (`/services`)
- **Purpose**: Implement business logic
- **Responsibilities**:
  - Business rule validation
  - Data transformation
  - Orchestrating multiple repository calls
  - Business-specific error handling
  - Transaction management

### 3. Repositories Layer (`/repositories`)
- **Purpose**: Data access and persistence
- **Responsibilities**:
  - Database queries
  - Data mapping between database and entities
  - Database-specific error handling
  - Connection management

### 4. Entities Layer (`/entities`)
- **Purpose**: Data models and validation
- **Responsibilities**:
  - Define data structures
  - Input validation rules
  - Data transformation methods
  - Type safety with TypeScript interfaces

### 5. Database Layer (`/database`)
- **Purpose**: Database connection and schema management
- **Responsibilities**:
  - **Connection Management** (`/connection`): Database connection pooling and configuration
  - **Database Manager** (`manager.ts`): High-level database operations and lifecycle management
  - **Initialization** (`init.ts`): Schema setup and database initialization
  - **Schema** (`schema.sql`): Database table definitions and indexes

### 6. App Layer (`/app`)
- **Purpose**: Application setup and configuration
- **Responsibilities**:
  - Express middleware setup
  - Route registration
  - Error handling middleware
  - Static file serving

## Data Flow

```
HTTP Request → Controller → Service → Repository → Database
                ↓           ↓         ↓           ↓
HTTP Response ← Controller ← Service ← Repository ← Database
```

## Key Features

### 1. Dependency Injection
- Each layer depends on abstractions, not concrete implementations
- Easy to test and mock dependencies
- Loose coupling between layers

### 2. Error Handling
- Consistent error responses across all endpoints
- Proper HTTP status codes
- Detailed error messages in development mode

### 3. Validation
- Input validation at multiple layers
- Entity-level validation rules
- Service-level business rule validation

### 4. Type Safety
- Full TypeScript support
- Interface definitions for all data structures
- Compile-time error checking

### 5. Database Management
- Connection pooling for performance
- Automatic schema initialization
- Graceful connection handling
- Clean separation of connection and management concerns

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (development only)"
}
```

## Environment Configuration

The application uses environment variables for configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=batman_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Getting Started

1. Set up PostgreSQL database
2. Configure environment variables
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

The application will automatically:
- Connect to the database
- Initialize the schema
- Create sample data
- Start the HTTP server 