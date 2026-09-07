import {
  countTasksByUserId,
  createTask as createTaskModel,
  deleteTaskForUser,
  findTaskByIdForUser,
  findTasksByUserId,
  updateTaskForUser,
  getTaskStatsByUserId,
} from "../models/task.model.js";

import { ApiError } from "../utils/ApiError.js";

const normalizeTaskInput = ({
  title,
  description = null,
  status = "todo",
  priority = "medium",
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
    priority,
    dueDate: formattedDueDate,
  };
};

export const createTask = async ({
  userId,
  title,
  description,
  status,
  priority,
  dueDate,
}) => {
  const taskData = normalizeTaskInput({
    title,
    description,
    status,
    priority,
    dueDate,
  });

  return createTaskModel({
    userId,
    ...taskData,
  });
};

export const getTasks = async ({
  userId,
  page = 1,
  limit = 20,
  search = "",
  status = "",
  priority = "",
}) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const offset = (page - 1) * limit;

  const normalizedSearch = search.trim();
  const normalizedStatus = status.trim();
  const normalizedPriority = priority.trim();

  const [tasks, total] = await Promise.all([
    findTasksByUserId({
      userId,
      limit: parsedLimit,
      offset,
      search: normalizedSearch,
      status: normalizedStatus,
      priority: normalizedPriority,
    }),

    countTasksByUserId({
      userId,
      search: normalizedSearch,
      status: normalizedStatus,
      priority: normalizedPriority,
    }),
  ]);

  return {
    tasks,
    pagination: {
      page:parsedPage,
      limit:parsedLimit,
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
  priority,
  dueDate,
}) => {
  const existingTask = await findTaskByIdForUser(taskId, userId);

  if (!existingTask) {
    throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  }
  
  const updates = {};

  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) {
    updates.description = description === null ? null : description.trim();
  }
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (dueDate !== undefined) {
    if (dueDate === null) {
      updates.dueDate = null;
    } else {
      const dateObj = new Date(dueDate);
      updates.dueDate = !isNaN(dateObj.getTime())
        ? dateObj.toISOString().slice(0, 19).replace("T", " ")
        : null;
    }
  }

  const updatedTask = await updateTaskForUser({
    taskId,
    userId,
    updates,
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

export const getTaskStats = async (userId) => {
  return getTaskStatsByUserId(userId);
};