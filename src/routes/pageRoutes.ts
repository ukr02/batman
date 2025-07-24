import { Router } from 'express';
import { PageController } from '../controllers/PageController';
import { PageService } from '../services/PageService';
import { PageRepository } from '../repositories/PageRepository';
import { MetricService } from '../services/MetricService';
import { MetricRepository } from '../repositories/MetricRepository';
import { MetricsConfigRepository } from '../repositories/MetricsConfigRepository';
import { DatabaseManager } from '../database/manager';

const router = Router();

// Initialize dependencies
const db = new DatabaseManager();
const pageRepository = new PageRepository(db.getConnection());
const metricRepository = new MetricRepository(db.getConnection());
const metricsConfigRepository = new MetricsConfigRepository(db.getConnection());
const metricService = new MetricService(metricRepository, metricsConfigRepository);
const pageService = new PageService(pageRepository, metricService);
const pageController = new PageController(pageService);

// Bind controller methods to preserve 'this' context
const createPage = pageController.createPage.bind(pageController);
const getPagesByService = pageController.getPagesByService.bind(pageController);
const getPageWithMetrics = pageController.getPageWithMetrics.bind(pageController);

// Page endpoints
router.post("/", createPage); // POST /page - Create page and trigger metrics
router.get("/:svc_id", getPagesByService); // GET /page/:svc_id - Get pages by service ID

// Frontend API endpoints
router.get("/page/:page_id", getPageWithMetrics); // GET /page/:page_id - Get page with metrics

export { router as pageRoutes }; 