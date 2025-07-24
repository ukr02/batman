import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { DatabaseConnection } from './connection/connection';

export class DatabaseInitializer {
  private pool: Pool;

  constructor() {
    const dbConnection = DatabaseConnection.getInstance();
    this.pool = dbConnection.getPool();
  }

  async initializeDatabase(): Promise<void> {
    try {
      console.log('🔧 Initializing database...');
      
      // Read and execute schema file
      await this.runSchema();
      
      console.log('✅ Database initialization completed successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async runSchema(): Promise<void> {
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split the schema into individual statements
      const statements = schema
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await this.pool.query(statement);
        }
      }
      
      console.log('📋 Database schema executed successfully');
    } catch (error) {
      console.error('❌ Failed to execute schema:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
} 