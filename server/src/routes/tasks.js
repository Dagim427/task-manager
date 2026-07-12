import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controller/tasksController.js";

const router = express.Router();

// Chain routes that share the same path
router.route("/").get(getTasks).post(createTask);

// Routes that require a specific ID (/api/tasks/:id)
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
