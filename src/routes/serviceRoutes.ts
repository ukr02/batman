import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { ServiceService } from '../services/ServiceService';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { DatabaseManager } from '../database/manager';

const router = Router();

// Initialize dependencies
const db = new DatabaseManager();
const serviceRepository = new ServiceRepository(db.getConnection());
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

// Bind controller methods to preserve 'this' context
const getAllServices = serviceController.getAllServices.bind(serviceController);
const getServiceById = serviceController.getServiceById.bind(serviceController);
const createService = serviceController.createService.bind(serviceController);
const updateService = serviceController.updateService.bind(serviceController);
const deleteService = serviceController.deleteService.bind(serviceController);

// Service CRUD endpoints
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export { router as serviceRoutes }; 