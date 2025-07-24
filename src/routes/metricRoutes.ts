import { Router } from 'express';
import { MetricController } from '../controllers/MetricController';
import { MetricService } from '../services/MetricService';
import { MetricRepository } from '../repositories/MetricRepository';
import { MetricsConfigRepository } from '../repositories/MetricsConfigRepository';
import { DatabaseManager } from '../database/manager';

const router = Router();

// Initialize dependencies
const db = new DatabaseManager();
const metricRepository = new MetricRepository(db.getConnection());
const metricsConfigRepository = new MetricsConfigRepository(db.getConnection());
const metricService = new MetricService(metricRepository, metricsConfigRepository);
const metricController = new MetricController(metricService);

// Bind controller methods to preserve 'this' context
const generateMetricsForDate = metricController.generateMetricsForDate.bind(metricController);
const generateMetricsForService = metricController.generateMetricsForService.bind(metricController);
const getAllMetrics = metricController.getAllMetrics.bind(metricController);
const getMetricById = metricController.getMetricById.bind(metricController);
const createMetric = metricController.createMetric.bind(metricController);
const updateMetric = metricController.updateMetric.bind(metricController);
const deleteMetric = metricController.deleteMetric.bind(metricController);

// Metric generation endpoints
router.post("/generate/date", generateMetricsForDate);
router.post("/generate/service", generateMetricsForService);

// Standard CRUD endpoints
router.get("/", getAllMetrics);
router.get("/:id", getMetricById);
router.post("/", createMetric);
router.put("/:id", updateMetric);
router.delete("/:id", deleteMetric);

export { router as metricRoutes }; 