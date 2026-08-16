import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // Skip console.error during tests for standard 4xx operational errors
  const isTestEnv = process.env.NODE_ENV === "test";
  const isServerInternalError = !error.statusCode || error.statusCode >= 500;

  if (!isTestEnv || isServerInternalError) {
    console.error(error);
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
    code: "INTERNAL_SERVER_ERROR",
  });
};