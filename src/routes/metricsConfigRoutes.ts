import { Router } from 'express';
import { MetricsConfigController } from '../controllers/MetricsConfigController';
import { MetricsConfigService } from '../services/MetricsConfigService';
import { MetricsConfigRepository } from '../repositories/MetricsConfigRepository';
import { AppDataSource } from '../database/data-source';
import { MetricsConfig } from '../entities/MetricsConfig';

export const createMetricsConfigRoutes = () => {
  const router = Router();

  // Initialize dependencies with TypeORM repositories
  const metricsConfigRepository = new MetricsConfigRepository(AppDataSource.getRepository(MetricsConfig));
  const metricsConfigService = new MetricsConfigService(metricsConfigRepository);
  const metricsConfigController = new MetricsConfigController(metricsConfigService);

  // Bind controller methods to preserve 'this' context
  const getAllMetricsConfigs = metricsConfigController.getAllMetricsConfigs.bind(metricsConfigController);
  const getMetricsConfigById = metricsConfigController.getMetricsConfigById.bind(metricsConfigController);
  const createMetricsConfig = metricsConfigController.createMetricsConfig.bind(metricsConfigController);
  const updateMetricsConfig = metricsConfigController.updateMetricsConfig.bind(metricsConfigController);
  const deleteMetricsConfig = metricsConfigController.deleteMetricsConfig.bind(metricsConfigController);

  // MetricsConfig CRUD endpoints
  router.get("/", getAllMetricsConfigs);
  router.get("/:id", getMetricsConfigById);
  router.post("/", createMetricsConfig);
  router.put("/:id", updateMetricsConfig);
  router.delete("/:id", deleteMetricsConfig);

  return router;
}; 