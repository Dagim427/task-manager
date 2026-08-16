import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isTestEnv = process.env.NODE_ENV === "test";
  const isServerInternalError = !error.statusCode || error.statusCode >= 500;

  // Only print to console for true server errors (5xx) that happen outside of tests.
  // This keeps test outputs clean from expected 4xx client errors.
  if (!isTestEnv && isServerInternalError) {
    console.error(error);
  }

  // Use appropriate log level depending on whether it's a client error or server crash
  if (isServerInternalError) {
    req.log.error({ err: error }, "Unhandled application error");
  } else {
    req.log.warn({ err: { message: error.message, code: error.code } }, `Client error: ${error.message}`);
  }

  // Handle known operational ApiErrors
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  // Fallback for unexpected internal errors
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
    code: "INTERNAL_SERVER_ERROR",
  });
};