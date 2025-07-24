import { Router } from 'express';
import { MetricController } from '../controllers/MetricController';
import { MetricService } from '../services/MetricService';
import { MetricRepository } from '../repositories/MetricRepository';
import { MetricsConfigRepository } from '../repositories/MetricsConfigRepository';
import { AppDataSource } from '../database/data-source';
import { Metric } from '../entities/Metric';
import { MetricsConfig } from '../entities/MetricsConfig';

export const createMetricRoutes = () => {
  const router = Router();

  // Initialize dependencies with TypeORM repositories
  const metricRepository = new MetricRepository(AppDataSource.getRepository(Metric));
  const metricsConfigRepository = new MetricsConfigRepository(AppDataSource.getRepository(MetricsConfig));
  const metricService = new MetricService(metricRepository, metricsConfigRepository);
  const metricController = new MetricController(metricService);

  // Bind controller methods to preserve 'this' context
  const getAllMetrics = metricController.getAllMetrics.bind(metricController);
  const getMetricById = metricController.getMetricById.bind(metricController);
  const createMetric = metricController.createMetric.bind(metricController);
  const updateMetric = metricController.updateMetric.bind(metricController);
  const deleteMetric = metricController.deleteMetric.bind(metricController);

  // Metric CRUD endpoints
  router.get("/", getAllMetrics);
  router.get("/:id", getMetricById);
  router.post("/", createMetric);
  router.put("/:id", updateMetric);
  router.delete("/:id", deleteMetric);

  return router;
}; 