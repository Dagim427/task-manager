import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controller/tasksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Chain routes that share the same path (protected)
router.route("/").get(authMiddleware, getTasks).post(authMiddleware, createTask);

// Routes that require a specific ID (/api/tasks/:id) (protected)
router.route("/:id").put(authMiddleware, updateTask).delete(authMiddleware, deleteTask);

export default router;
