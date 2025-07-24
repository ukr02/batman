import { Repository } from 'typeorm';
import { Product, CreateProductRequest, UpdateProductRequest } from '../entities/Product';

export class ProductRepository {
  private repository: Repository<any>; // Using any since Product is an interface

  constructor(repository: Repository<any>) {
    this.repository = repository;
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.repository.find({
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error}`);
    }
  }

  async findById(id: number): Promise<Product | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to fetch product with id ${id}: ${error}`);
    }
  }

  async findByCategory(category: string): Promise<Product[]> {
    try {
      return await this.repository.find({
        where: { category },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new Error(`Failed to fetch products by category ${category}: ${error}`);
    }
  }

  async create(productData: CreateProductRequest): Promise<Product> {
    try {
      const product = this.repository.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category
      });
      return await this.repository.save(product);
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  async update(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    try {
      const updateData: Partial<Product> = {};

      if (productData.name !== undefined) {
        updateData.name = productData.name;
      }

      if (productData.description !== undefined) {
        updateData.description = productData.description;
      }

      if (productData.price !== undefined) {
        updateData.price = productData.price;
      }

      if (productData.category !== undefined) {
        updateData.category = productData.category;
      }

      if (Object.keys(updateData).length === 0) {
        return await this.findById(id);
      }

      await this.repository.update(id, updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update product with id ${id}: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      throw new Error(`Failed to delete product with id ${id}: ${error}`);
    }
  }
} 