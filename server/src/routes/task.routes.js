import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  createTaskValidator,
  taskIdValidator,
  updateTaskValidator,
} from "../validators/task.validator.js";

import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  createTaskValidator,
  validate,
  createTask,
);

router.get(
  "/",
  getTasks,
);

router.get(
  "/:taskId",
  taskIdValidator,
  validate,
  getTask,
);

router.put(
  "/:taskId",
  updateTaskValidator,
  validate,
  updateTask,
);

router.delete(
  "/:taskId",
  taskIdValidator,
  validate,
  deleteTask,
);

export default router;