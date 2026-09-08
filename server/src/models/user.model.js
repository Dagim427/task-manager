import pool from "../config/database.js";

const SAFE_USER_COLUMNS = `
  id,
  name,
  email,
  created_at,
  updated_at
`;

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    `
      SELECT ${SAFE_USER_COLUMNS}, password_hash
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  return rows[0] ?? null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    `
      SELECT ${SAFE_USER_COLUMNS}
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] ?? null;
};

export const createUser = async ({ name, email, passwordHash }) => {
  const [result] = await pool.execute(
    `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES (?, ?, ?)
    `,
    [name, email, passwordHash],
  );

  return findUserById(result.insertId);
};
