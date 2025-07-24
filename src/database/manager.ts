import { DatabaseConnection } from './connection/connection';
import { DatabaseInitializer } from './init';

export class DatabaseManager {
  private dbConnection: DatabaseConnection;
  private initializer: DatabaseInitializer;

  constructor() {
    this.dbConnection = DatabaseConnection.getInstance();
    this.initializer = new DatabaseInitializer();
  }

  public async initialize(): Promise<void> {
    try {
      const isConnected = await this.dbConnection.testConnection();
      if (!isConnected) {
        throw new Error('Failed to establish database connection');
      }

      // Initialize database schema
      await this.initializer.initializeDatabase();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  public getConnection() {
    return this.dbConnection.getPool();
  }

  public async close(): Promise<void> {
    await this.dbConnection.closeConnection();
  }
} 