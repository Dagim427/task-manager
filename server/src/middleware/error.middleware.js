export const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message:
      statusCode === 500 ? "An unexpected error occurred." : error.message,
    code: error.code || "INTERNAL_SERVER_ERROR",
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error({
      method: req.method,
      path: req.originalUrl,
      statusCode,
      error: error.message,
      stack: error.stack,
    });
  }

  return res.status(statusCode).json(response);
};
