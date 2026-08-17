import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { logger } from "./src/config/logger.js";
import pool, { testDatabaseConnection } from "./src/config/database.js";

const startServer = async () => {
  try {
    await testDatabaseConnection();
    logger.info("Database connection established successfully.");

    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
        },
        "API server started",
      );
    });

    let isShuttingDown = false;

    const shutdown = async (signal) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      logger.info({ signal }, "Shutdown signal received");

      server.close(async (serverError) => {
        if (serverError) {
          logger.error(
            {
              err: serverError,
            },
            "Failed to close HTTP server",
          );

          process.exitCode = 1;
        }

        try {
          await pool.end();

          logger.info("Database connection pool closed");

          process.exit();
        } catch (error) {
          logger.error(
            {
              err: error,
            },
            "Failed to close database pool",
          );

          process.exit(1);
        }
      });
    };

    // Process-level graceful shutdown and error handlers
    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("uncaughtException", (error) => {
      logger.fatal({ err: error }, "Uncaught exception");

      void shutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason) => {
      logger.fatal({ reason }, "Unhandled promise rejection");

      void shutdown("unhandledRejection");
    });
  } catch (error) {
    logger.fatal(
      { err: error.message },
      "Database connection failed. Aborting server startup.",
    );
    process.exit(1);
  }
};

void startServer();
