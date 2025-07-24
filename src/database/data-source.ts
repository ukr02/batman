import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Page } from "../entities/Page";
import { Service } from "../entities/Service";
import { Metric } from "../entities/Metric";
import { MetricsConfig } from "../entities/MetricsConfig";
import { ActionItem } from "../entities/ActionItem";

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "batman",
  synchronize: false, // Set to false in production
  logging: process.env.NODE_ENV === "development",
  entities: [Page, Service, Metric, MetricsConfig, ActionItem],
  migrations: [],
  subscribers: [],
});

export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
}; 