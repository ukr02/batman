import { Pool } from 'pg';
import { User, CreateUserRequest, UpdateUserRequest } from '../entities/User';

export class UserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<User[]> {
    try {
      const query = 'SELECT * FROM users ORDER BY created_at DESC';
      const result = await this.pool.query(query);
      return this.mapRowsToEntities(result.rows);
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch user with id ${id}: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await this.pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch user with email ${email}: ${error}`);
    }
  }

  async create(userData: CreateUserRequest): Promise<User> {
    try {
      const query = `
        INSERT INTO users (name, email, created_at, updated_at) 
        VALUES ($1, $2, NOW(), NOW()) 
        RETURNING *
      `;
      const values = [userData.name, userData.email];
      const result = await this.pool.query(query, values);
      
      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async update(id: number, userData: UpdateUserRequest): Promise<User | null> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (userData.name !== undefined) {
        updateFields.push(`name = $${paramIndex}`);
        values.push(userData.name);
        paramIndex++;
      }

      if (userData.email !== undefined) {
        updateFields.push(`email = $${paramIndex}`);
        values.push(userData.email);
        paramIndex++;
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(id);

      const query = `
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;
      
      const result = await this.pool.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to update user with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      throw new Error(`Failed to delete user with id ${id}: ${error}`);
    }
  }

  private mapRowToEntity(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      created_at: row.created_at ? new Date(row.created_at) : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined
    };
  }

  private mapRowsToEntities(rows: any[]): User[] {
    return rows.map(row => this.mapRowToEntity(row));
  }
} 