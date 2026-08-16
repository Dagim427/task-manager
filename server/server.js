import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { logger } from "./src/config/logger.js";
import { testDatabaseConnection } from "./src/config/database.js";

const startServer = async () => {
  try {
    await testDatabaseConnection();
    logger.info("Database connection established successfully.");

    const server = app.listen(env.PORT || env.port, () => {
      logger.info(
        {
          port: env.PORT || env.port,
          environment: env.NODE_ENV || env.nodeEnv,
        },
        "API server started",
      );
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error({ err: error }, "Failed to start server.");
    process.exit(1);
  }
};

startServer();
