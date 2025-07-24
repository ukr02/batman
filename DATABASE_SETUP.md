# Database Setup Guide

## PostgreSQL Configuration

This project uses PostgreSQL as the database. Follow these steps to set up your database:

### 1. Install PostgreSQL

Make sure PostgreSQL is installed and running on your system.

### 2. Create Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=batman_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Create Database

Connect to PostgreSQL and create the database:

```sql
CREATE DATABASE batman_db;
```

### 4. Test Connection

Run the development server to test the database connection:

```bash
npm run dev
```

You should see: `✅ PostgreSQL database connection established successfully`

### 5. Database Architecture

The application uses a clean database architecture:

- **Connection Management** (`src/database/connection/connection.ts`): Handles database connection pooling and configuration
- **Database Manager** (`src/database/manager.ts`): High-level database operations and lifecycle management
- **Schema Initialization** (`src/database/init.ts`): Automatically sets up database tables and indexes
- **Schema Definition** (`src/database/schema.sql`): PostgreSQL table definitions and sample data

### 6. Database Connection Details

The application uses a connection pool with the following configuration:
- **Max connections**: 20
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds

### Troubleshooting

If you encounter connection issues:

1. Verify PostgreSQL is running
2. Check your database credentials in the `.env` file
3. Ensure the database `batman_db` exists
4. Verify the user has proper permissions

### Default Configuration

If no environment variables are provided, the application will use these defaults:
- Host: localhost
- Port: 5432
- Database: batman_db
- User: postgres
- Password: password 