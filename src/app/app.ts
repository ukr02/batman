import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { userRoutes } from '../routes/userRoutes';
import { productRoutes } from '../routes/productRoutes';
import { metricRoutes } from '../routes/metricRoutes';
import { pageRoutes } from '../routes/pageRoutes';
import { serviceRoutes } from '../routes/serviceRoutes';
import { metricsConfigRoutes } from '../routes/metricsConfigRoutes';

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS middleware
    this.app.use(cors());
    
    // Logging middleware
    this.app.use(morgan('combined'));
    
    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Static files middleware
    this.app.use(express.static(path.join(__dirname, '../../public')));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Batman API',
        version: '1.0.0'
      });
    });

    // Serve the main HTML page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../public/index.html'));
    });

    // API Routes
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/products', productRoutes);
    this.app.use('/api/metrics', metricRoutes);
    this.app.use('/api/page', pageRoutes);
    this.app.use('/api/service', serviceRoutes);
    this.app.use('/api/metric_config', metricsConfigRoutes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ 
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
      });
    });

    // Global error handling middleware
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
} 