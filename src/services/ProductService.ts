import { ProductRepository } from '../repositories/ProductRepository';
import { Product, CreateProductRequest, UpdateProductRequest } from '../entities/Product';
import { ProductEntity } from '../entities/Product';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.findAll();
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid product ID');
      }
      return await this.productRepository.findById(id);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      if (!category || category.trim().length === 0) {
        throw new Error('Category is required');
      }
      return await this.productRepository.findByCategory(category);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      // Validate input data
      const validation = ProductEntity.validate(productData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      return await this.productRepository.create(productData);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid product ID');
      }

      // Check if product exists
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        return null;
      }

      return await this.productRepository.update(id, productData);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid product ID');
      }

      // Check if product exists
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        return false;
      }

      return await this.productRepository.delete(id);
    } catch (error) {
      throw new Error(`Service error: ${error}`);
    }
  }
} 