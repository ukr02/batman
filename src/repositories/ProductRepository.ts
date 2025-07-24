import { Pool } from 'pg';
import { Product, CreateProductRequest, UpdateProductRequest } from '../entities/Product';

export class ProductRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<Product[]> {
    try {
      const query = 'SELECT * FROM products ORDER BY created_at DESC';
      const result = await this.pool.query(query);
      return this.mapRowsToEntities(result.rows);
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error}`);
    }
  }

  async findById(id: number): Promise<Product | null> {
    try {
      const query = 'SELECT * FROM products WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch product with id ${id}: ${error}`);
    }
  }

  async findByCategory(category: string): Promise<Product[]> {
    try {
      const query = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
      const result = await this.pool.query(query, [category]);
      return this.mapRowsToEntities(result.rows);
    } catch (error) {
      throw new Error(`Failed to fetch products by category ${category}: ${error}`);
    }
  }

  async create(productData: CreateProductRequest): Promise<Product> {
    try {
      const query = `
        INSERT INTO products (name, description, price, category, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, NOW(), NOW()) 
        RETURNING *
      `;
      const values = [productData.name, productData.description, productData.price, productData.category];
      const result = await this.pool.query(query, values);
      
      return this.mapRowToEntity(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  async update(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (productData.name !== undefined) {
        updateFields.push(`name = $${paramIndex}`);
        values.push(productData.name);
        paramIndex++;
      }

      if (productData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        values.push(productData.description);
        paramIndex++;
      }

      if (productData.price !== undefined) {
        updateFields.push(`price = $${paramIndex}`);
        values.push(productData.price);
        paramIndex++;
      }

      if (productData.category !== undefined) {
        updateFields.push(`category = $${paramIndex}`);
        values.push(productData.category);
        paramIndex++;
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(id);

      const query = `
        UPDATE products 
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
      throw new Error(`Failed to update product with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM products WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      throw new Error(`Failed to delete product with id ${id}: ${error}`);
    }
  }

  private mapRowToEntity(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price ? Number(row.price) : 0,
      category: row.category,
      created_at: row.created_at ? new Date(row.created_at) : undefined,
      updated_at: row.updated_at ? new Date(row.updated_at) : undefined
    };
  }

  private mapRowsToEntities(rows: any[]): Product[] {
    return rows.map(row => this.mapRowToEntity(row));
  }
} 