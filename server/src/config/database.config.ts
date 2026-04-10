import path from "path";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import logger from "./logger";
import { seedBadges, seedCourses, seedLessons, seedTextSamples } from "../utils/seed";

config();

const entityExt = process.env.NODE_ENV === "production" ? "js" : "ts";
const entitiesGlob = path.join(__dirname, "..", "entities", `**/*.${entityExt}`);

const baseOptions = {
  type: "postgres" as const,
  synchronize: true,
  logging: false,
  entities: [entitiesGlob],
  migrations: [],
  subscribers: [] as never[],
};

export const AppDataSource = new DataSource(
  process.env.DATABASE_URL
    ? {
        ...baseOptions,
        url: process.env.DATABASE_URL,
      }
    : {
        ...baseOptions,
        host: process.env.DB_HOST ?? "localhost",
        port: parseInt(process.env.DB_PORT ?? "5432", 10),
        username: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "password",
        database: process.env.DB_NAME ?? "postgres",
      }
);

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established");

    // adding seed after successful connection
    if (process.env.NODE_ENV === "development" || process.env.SEED_DATA === "true") {
      await seedTextSamples(AppDataSource);
      await seedCourses(AppDataSource);
      await seedBadges(AppDataSource);
      await seedLessons(AppDataSource);
      logger.info("Database seeding completed")
    }
  } catch (error) {
    logger.error("Error connecting to database:", error);
    throw error;
  }
};
