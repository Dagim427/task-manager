import dotenv from "dotenv/config";

import app from "./src/app.js";
import { testDatabaseConnection } from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testDatabaseConnection();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });

    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start server.");
    console.error(error);
    process.exit(1);
  }
};

startServer();
