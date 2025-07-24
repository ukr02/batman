import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { DatabaseManager } from '../database/manager';

const router = Router();

// Initialize dependencies
const db = new DatabaseManager();
const productRepository = new ProductRepository(db.getConnection());
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Bind controller methods to preserve 'this' context
const getAllProducts = productController.getAllProducts.bind(productController);
const getProductById = productController.getProductById.bind(productController);
const getProductsByCategory = productController.getProductsByCategory.bind(productController);
const createProduct = productController.createProduct.bind(productController);
const updateProduct = productController.updateProduct.bind(productController);
const deleteProduct = productController.deleteProduct.bind(productController);

// Routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export { router as productRoutes }; 