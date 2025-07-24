import { Router } from 'express';
import { PageController } from '../controllers/PageController';
import { PageService } from '../services/PageService';
import { PageRepository } from '../repositories/PageRepository';
import { MetricService } from '../services/MetricService';
import { MetricRepository } from '../repositories/MetricRepository';
import { MetricsConfigRepository } from '../repositories/MetricsConfigRepository';
import { AppDataSource } from '../database/data-source';
import { Page } from '../entities/Page';
import { Metric } from '../entities/Metric';
import { MetricsConfig } from '../entities/MetricsConfig';

export const createPageRoutes = () => {
  const router = Router();

  // Initialize dependencies with TypeORM repositories
  const pageRepository = new PageRepository(AppDataSource.getRepository(Page));
  const metricRepository = new MetricRepository(AppDataSource.getRepository(Metric));
  const metricsConfigRepository = new MetricsConfigRepository(AppDataSource.getRepository(MetricsConfig));
  const metricService = new MetricService(metricRepository, metricsConfigRepository);
  const pageService = new PageService(pageRepository, metricService);
  const pageController = new PageController(pageService);

  // Bind controller methods to preserve 'this' context
  const createPage = pageController.createPage.bind(pageController);
  const getPagesByService = pageController.getPagesByService.bind(pageController);
  const getPageWithMetrics = pageController.getPageWithMetrics.bind(pageController);
  const getPageDetails = pageController.getPageDetails.bind(pageController);
  const updateMetricState = pageController.updateMetricState.bind(pageController);

  // Page endpoints
  router.post("/", createPage); // POST /api/page - Create page and trigger metrics
  router.get("/service/:svc_id", getPagesByService); // GET /api/page/service/:svc_id - Get pages by service ID

  // Frontend API endpoints
  router.get("/details/:page_id", getPageDetails); // GET /api/page/details/:page_id - Get page details in API format
  router.get("/page/:page_id", getPageWithMetrics); // GET /api/page/page/:page_id - Get page with metrics

  // Metric endpoints
  router.put("/metric/:metric_id/state", updateMetricState); // PUT /api/page/metric/:metric_id/state - Update metric state

  return router;
}; 