import { asyncHandler } from "../utils/asyncHandler.js"; 
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getTask as getTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
} from "../services/task.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService({
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: {
      task,
    },
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 20;

  const result = await getTasksService({
    userId: req.user.id,
    page,
    limit,
  });

  return res.status(200).json({
    success: true,
    message: "Tasks retrieved successfully.",
    data: result,
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskService({
    taskId: req.params.taskId,
    userId: req.user.id,
  });

  return res.status(200).json({
    success: true,
    message: "Task retrieved successfully.",
    data: {
      task,
    },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await updateTaskService({
    taskId: req.params.taskId,
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
  });

  return res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: {
      task,
    },
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await deleteTaskService({
    taskId: req.params.taskId,
    userId: req.user.id,
  });

  return res.status(204).send();
});