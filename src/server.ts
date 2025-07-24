import { App } from './app/app';
import { DatabaseManager } from './database/manager';

const PORT = process.env.PORT || 3000;

// Initialize database
const db = new DatabaseManager();

// Initialize app
const app = new App();
const expressApp = app.getApp();

// Initialize database and start server
async function startServer() {
  try {
    await db.initialize();
    
    expressApp.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
      console.log(`📊 API Documentation available at http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Closing server gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Closing server gracefully...');
  await db.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error);
  await db.close();
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  await db.close();
  process.exit(1);
});

startServer(); 