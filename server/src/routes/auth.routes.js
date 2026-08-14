import { Router } from "express";

import { register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerValidator } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerValidator, validate, register);

export default router;
