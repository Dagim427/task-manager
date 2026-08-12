import mysql from "mysql2/promise";

let pool;

export const getPool = () => {
  if (!pool) {
    const requiredDatabaseVariables = [
      "DB_HOST",
      "DB_PORT",
      "DB_NAME",
      "DB_USER",
      "DB_PASSWORD",
    ];

    for (const variable of requiredDatabaseVariables) {
      if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
      }
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
};

export const testDatabaseConnection = async () => {
  let connection;

  try {
    const dbPool = getPool();
    connection = await dbPool.getConnection();
    await connection.ping();

    console.log("✅ Database connection established.");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  } finally {
    connection?.release();
  }
};

export default getPool;