import pool from "../config/database.js";

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

export const updateTaskForUser = async ({
  taskId,
  userId,
  title,
  description,
  status,
  priority,
  dueDate,
}) => {
  const query = `
    UPDATE tasks 
    SET 
      title = COALESCE(?, title), 
      description = COALESCE(?, description), 
      status = COALESCE(?, status), 
      priority = COALESCE(?, priority),
      due_date = COALESCE(?, due_date) 
    WHERE id = ? AND user_id = ?
  `;

  await pool.execute(query, [
    title !== undefined ? title : null,
    description !== undefined ? description : null,
    status !== undefined ? status : null,
    priority !== undefined ? priority : null,
    dueDate !== undefined ? dueDate : null,
    taskId,
    userId,
  ]);

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
