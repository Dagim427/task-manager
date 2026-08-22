import pool from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

const TASK_COLUMNS = `
  id,
  user_id,
  title,
  description,
  status,
  priority,
  due_date,
  created_at,
  updated_at
`;

export const createTask = async ({
  userId,
  title,
  description = null,
  status,
  priority,
  dueDate = null,
}) => {
  const [result] = await pool.execute(
    `
      INSERT INTO tasks (
        user_id,
        title,
        description,
        status,
        priority, 
        due_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [userId, title, description, status, priority, dueDate],
  );

  return findTaskByIdForUser(result.insertId, userId);
};

export const findTasksByUserId = async ({ userId, limit, offset }) => {
  const [rows] = await pool.execute(
    `
      SELECT ${TASK_COLUMNS}
      FROM tasks
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ?
      OFFSET ?
    `,
    [userId, limit, offset],
  );

  return rows;
};

export const findTaskByIdForUser = async (taskId, userId) => {
  const [rows] = await pool.execute(
    `
      SELECT ${TASK_COLUMNS}
      FROM tasks
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
    `,
    [taskId, userId],
  );

  return rows[0] || null;
};

export const updateTaskForUser = async ({ taskId, userId, updates }) => {
  const fields = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(updates, "title")) {
    fields.push("title = ?");
    values.push(updates.title);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "description")) {
    fields.push("description = ?");
    values.push(updates.description);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "status")) {
    fields.push("status = ?");
    values.push(updates.status);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "priority")) {
    fields.push("priority = ?");
    values.push(updates.priority);
  }

  if (Object.prototype.hasOwnProperty.call(updates, "dueDate")) {
    fields.push("due_date = ?");
    values.push(updates.dueDate);
  }

  if (fields.length === 0) {
    throw new ApiError(
      400,
      "At least one task field must be provided.",
      "NO_UPDATE_FIELDS",
    );
  }

  values.push(taskId);
  values.push(userId);

 await pool.execute(
    `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = ?
        AND user_id = ?
    `,
    values,
  );

  return findTaskByIdForUser(taskId, userId);
};

export const deleteTaskForUser = async (taskId, userId) => {
  const [result] = await pool.execute(
    `
      DELETE FROM tasks
      WHERE id = ?
        AND user_id = ?
    `,
    [taskId, userId],
  );

  return result.affectedRows > 0;
};

export const countTasksByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `
      SELECT COUNT(*) AS total
      FROM tasks
      WHERE user_id = ?
    `,
    [userId],
  );

  return Number(rows[0].total);
};
