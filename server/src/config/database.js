import mysql from "mysql2/promise";

import { env } from "./env.js";

const pool = mysql.createPool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,

  waitForConnections: true,
  connectionLimit: 10,
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

export default pool;
