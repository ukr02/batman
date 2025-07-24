import { Router } from 'express';
import { MetricsConfigController } from '../controllers/MetricsConfigController';
import { MetricsConfigService } from '../services/MetricsConfigService';
import { MetricsConfigRepository } from '../repositories/MetricsConfigRepository';
import { DatabaseManager } from '../database/manager';

const router = Router();

// Initialize dependencies
const db = new DatabaseManager();
const metricsConfigRepository = new MetricsConfigRepository(db.getConnection());
const metricsConfigService = new MetricsConfigService(metricsConfigRepository);
const metricsConfigController = new MetricsConfigController(metricsConfigService);

// Bind controller methods to preserve 'this' context
const getAllMetricsConfigs = metricsConfigController.getAllMetricsConfigs.bind(metricsConfigController);
const getMetricsConfigById = metricsConfigController.getMetricsConfigById.bind(metricsConfigController);
const getMetricsConfigsByServiceId = metricsConfigController.getMetricsConfigsByServiceId.bind(metricsConfigController);
const createMetricsConfig = metricsConfigController.createMetricsConfig.bind(metricsConfigController);
const updateMetricsConfig = metricsConfigController.updateMetricsConfig.bind(metricsConfigController);
const deleteMetricsConfig = metricsConfigController.deleteMetricsConfig.bind(metricsConfigController);

// Metrics config CRUD endpoints
router.get("/", getAllMetricsConfigs);
router.get("/:id", getMetricsConfigById);
router.get("/service/:serviceId", getMetricsConfigsByServiceId);
router.post("/", createMetricsConfig);
router.put("/:id", updateMetricsConfig);
router.delete("/:id", deleteMetricsConfig);

export { router as metricsConfigRoutes }; 