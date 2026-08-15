import {
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
}) => ({
  title: title.trim(),
  description:
    typeof description === "string" ? description.trim() || null : null,
  status,
  dueDate: dueDate || null,
});

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

export const getTasks = async (userId) => {
  return findTasksByUserId(userId);
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

  return updateTaskForUser({
    taskId,
    userId,
    ...taskData,
  });
};

export const deleteTask = async ({ taskId, userId }) => {
  const existingTask = await findTaskByIdForUser(taskId, userId);

  if (!existingTask) {
    throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  }

  await deleteTaskForUser(taskId, userId);
};
