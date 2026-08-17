import mysql from "mysql2/promise";

import { env } from "./env.js";

const pool = mysql.createPool({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,

  waitForConnections: true,
  connectionLimit: env.NODE_ENV === "production" ? 20 : 10,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export const testDatabaseConnection = async () => {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.ping();

    console.log("✅ Database connection established.");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  } finally {
    connection?.release();
  }
};

export const checkDatabaseConnection = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
};

export default pool;
