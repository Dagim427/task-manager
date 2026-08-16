import { checkDatabaseConnection } from "../config/database.js";

export const liveness = (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
  });
};

export const readiness = async (req, res, next) => {
  try {
    await checkDatabaseConnection();

    return res.status(200).json({
      success: true,
      status: "ready",
    });
  } catch (error) {
    return next(error);
  }
};