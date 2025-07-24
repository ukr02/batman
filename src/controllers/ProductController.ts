import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CreateProductRequest, UpdateProductRequest } from '../entities/Product';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json({
        success: true,
        data: products,
        message: 'Products retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
        message: 'Product retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      
      if (!category) {
        res.status(400).json({
          success: false,
          error: 'Category parameter is required'
        });
        return;
      }

      const products = await this.productService.getProductsByCategory(category);
      
      res.status(200).json({
        success: true,
        data: products,
        message: `Products in category '${category}' retrieved successfully`
      });
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductRequest = req.body;

      if (!productData.name || productData.price === undefined) {
        res.status(400).json({
          success: false,
          error: 'Name and price are required'
        });
        return;
      }

      const product = await this.productService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
      });
    } catch (error) {
      console.error('Error in createProduct:', error);
      
      if (error instanceof Error && error.message.includes('Validation failed')) {
        res.status(400).json({
          success: false,
          error: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const productData: UpdateProductRequest = req.body;

      if (!productData.name && !productData.description && productData.price === undefined && !productData.category) {
        res.status(400).json({
          success: false,
          error: 'At least one field is required for update'
        });
        return;
      }

      const product = await this.productService.updateProduct(id, productData);
      
      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Error in updateProduct:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const deleted = await this.productService.deleteProduct(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
} 