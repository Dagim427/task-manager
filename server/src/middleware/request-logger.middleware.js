import crypto from "node:crypto";
import pinoHttp from "pino-http";

import { logger } from "../config/logger.js";

export const requestLogger = pinoHttp({
  logger,

  genReqId: (req, res) => {
    const incomingRequestId = req.headers["x-request-id"];

    const requestId =
      typeof incomingRequestId === "string" && incomingRequestId.length <= 100
        ? incomingRequestId
        : crypto.randomUUID();

    res.setHeader("X-Request-ID", requestId);

    return requestId;
  },

  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },

  customSuccessMessage: (req) => `${req.method} ${req.originalUrl} completed`,

  customErrorMessage: (req) => `${req.method} ${req.originalUrl} failed`,

  customProps: (req) => ({
    userId: req.user?.id ?? null,
  }),
});
