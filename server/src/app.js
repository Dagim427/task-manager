import express from "express";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { corsOptions } from "./config/cors.js";
import { globalRateLimiter } from "./config/rate-limit.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(cors(corsOptions));

app.use(globalRateLimiter);

app.use(requestLogger);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(compression());

if (env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

export default app;
