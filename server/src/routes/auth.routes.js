import { Router } from "express";

import { authRateLimiter } from "../config/rate-limit.js";
import {
  getCurrentUser,
  login,
  register,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  registerValidator,
  validate,
  register,
);
router.post("/login", authRateLimiter, loginValidator, validate, login);
router.get("/me", authenticate, getCurrentUser);

export default router;
