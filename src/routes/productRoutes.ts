import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { AppDataSource } from '../database/data-source';

export const createProductRoutes = () => {
  const router = Router();

  // Initialize dependencies with TypeORM repositories
  const productRepository = new ProductRepository(AppDataSource.getRepository('products'));
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  // Bind controller methods to preserve 'this' context
  const getAllProducts = productController.getAllProducts.bind(productController);
  const getProductById = productController.getProductById.bind(productController);
  const createProduct = productController.createProduct.bind(productController);
  const updateProduct = productController.updateProduct.bind(productController);
  const deleteProduct = productController.deleteProduct.bind(productController);

  // Product CRUD endpoints
  router.get("/", getAllProducts);
  router.get("/:id", getProductById);
  router.post("/", createProduct);
  router.put("/:id", updateProduct);
  router.delete("/:id", deleteProduct);

  return router;
}; 