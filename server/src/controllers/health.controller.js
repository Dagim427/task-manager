import { checkDatabaseConnection } from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const liveness = (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
  });
};

export const readiness = asyncHandler(async (req, res) => {
  await checkDatabaseConnection();

  return res.status(200).json({
    success: true,
    status: "ready",
  });
});
