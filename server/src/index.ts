import { initializeDatabase } from "./config/database.config";
import { appConfig } from "./config/app.config";
import logger from "./config/logger";
import app from "./app";


const startServer = async () => {
  try {
    logger.info("Initializing database connection...");
    await initializeDatabase();

    app.listen(appConfig.port, () => {
      logger.info(
        `Server running in ${appConfig.env} mode on port ${appConfig.port}`
      );
      // Only log status monitor in development (security best practice)
      if (appConfig.env === "development") {
        logger.info(
          `Status monitor: http://localhost:${appConfig.port}/status`
        );
      }

      logger.info(
        `Health check endpoint: http://localhost:${appConfig.port}/api/health`
      );
    });
  } catch (error) {
    logger.error("Failed to start server");
    logger.error(
      error instanceof Error ? error.stack ?? error.message : String(error)
    );

    process.exit(1);
  }
};

startServer();
