import {
  countTasksByUserId,
  createTask as createTaskModel,
  deleteTaskForUser,
  findTaskByIdForUser,
  findTasksByUserId,
  updateTaskForUser,
} from "../models/task.model.js";

import { ApiError } from "../utils/ApiError.js";

const normalizeTaskInput = ({
  title,
  description = null,
  status = "todo",
  dueDate = null,
}) => {
  let formattedDueDate = null;

  if (dueDate) {
    const dateObj = new Date(dueDate);
    if (!isNaN(dateObj.getTime())) {
      // Format to YYYY-MM-DD HH:MM:SS for MySQL DATETIME
      formattedDueDate = dateObj.toISOString().slice(0, 19).replace("T", " ");
    }
  }

  return {
    title: title.trim(),
    description:
      typeof description === "string" ? description.trim() || null : null,
    status,
    dueDate: formattedDueDate,
  };
};

export const createTask = async ({ userId, title, description, dueDate }) => {
  const taskData = normalizeTaskInput({
    title,
    description,
    dueDate,
  });

  return createTaskModel({
    userId,
    ...taskData,
  });
};

export const getTasks = async ({ userId, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    findTasksByUserId({
      userId,
      limit,
      offset,
    }),

    countTasksByUserId(userId),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTask = async ({ taskId, userId }) => {
  const task = await findTaskByIdForUser(taskId, userId);

  if (!task) {
    throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  }

  return task;
};

export const updateTask = async ({
  taskId,
  userId,
  title,
  description,
  status,
  dueDate,
}) => {
  const existingTask = await findTaskByIdForUser(taskId, userId);

  if (!existingTask) {
    throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  }

  const taskData = normalizeTaskInput({
    title,
    description,
    status,
    dueDate,
  });

  const updatedTask = await updateTaskForUser({
    taskId,
    userId,
    ...taskData,
  });

  if (!updatedTask) {
    throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  }

  return updatedTask;
};

export const deleteTask = async ({ taskId, userId }) => {
  const existingTask = await findTaskByIdForUser(taskId, userId);

  if (!existingTask) {
    throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  }

  const deleted = await deleteTaskForUser(taskId, userId);

  if (!deleted) {
    throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  }
};
