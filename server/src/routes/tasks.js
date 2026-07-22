import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controller/tasksController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(authMiddleware, getTasks).post(authMiddleware, createTask);
router.route("/:id").put(authMiddleware, updateTask).delete(authMiddleware, deleteTask);

export default router;
