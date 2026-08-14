import pool from "../../src/config/database.js";

export const clearUsersTable = async () => {
  await pool.execute("DELETE FROM users");
};

export const closeDatabase = async () => {
  await pool.end();
};
