import { Router } from 'express';
import { MetricController } from '../controllers/MetricController';
import { MetricService } from '../services/MetricService';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { AppDataSource } from '../database/data-source';
import { Metric } from '../entities/Metric';
import { MetricsConfig } from '../entities/MetricsConfig';
import { Service } from '../entities/Service';
import { PageRepository } from '../repositories/PageRepository';
import { Page } from '../entities/Page';
import { MetricRepository } from '../repositories/MetricRepository';
import { MetricsConfigRepository } from '../repositories/MetricsConfigRepository';

export const createMetricRoutes = () => {
  const router = Router();

  // Initialize dependencies with TypeORM repositories
  const metricRepository = new MetricRepository(AppDataSource.getRepository(Metric));
  const metricsConfigRepository = new MetricsConfigRepository(AppDataSource.getRepository(MetricsConfig));
  const serviceRepository = new ServiceRepository(AppDataSource.getRepository(Service));
  const pageRepository = new PageRepository(AppDataSource.getRepository(Page));
  const metricService = new MetricService(metricRepository, metricsConfigRepository, pageRepository, serviceRepository);
  const metricController = new MetricController(metricService);

  // Bind controller methods to preserve 'this' context
  const getAllMetrics = metricController.getAllMetrics.bind(metricController);
  const getMetricById = metricController.getMetricById.bind(metricController);
  const createMetric = metricController.createMetric.bind(metricController);
  const updateMetric = metricController.updateMetric.bind(metricController);
  const deleteMetric = metricController.deleteMetric.bind(metricController);
  const generateMetricsForDate = metricController.generateMetricsForDate.bind(metricController);
  const generateMetricsForService = metricController.generateMetricsForService.bind(metricController);
  const generateMetricSummary = metricController.generateMetricSummary.bind(metricController);
  const generateOpsgenieSummary = metricController.generateOpsgenieSummary.bind(metricController);

  // Metric CRUD endpoints
  router.get("/", getAllMetrics);
  router.get("/:id", getMetricById);
  router.post("/", createMetric);
  router.put("/:id", updateMetric);
  router.delete("/:id", deleteMetric);

  // Metric generation endpoints
  router.post("/generate/date", generateMetricsForDate);
  router.post("/generate/service", generateMetricsForService);
  router.post("/metrics-summary/generate", generateMetricSummary);
  router.post("/opsgenie/summary", generateOpsgenieSummary);

  return router;
}; 