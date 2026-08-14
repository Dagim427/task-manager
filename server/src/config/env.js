import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const requiredVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const port = Number(process.env.PORT || 5000);
const dbPort = Number(process.env.DB_PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a valid positive integer.");
}

if (!Number.isInteger(dbPort) || dbPort <= 0) {
  throw new Error("DB_PORT must be a valid positive integer.");
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",

  port,

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  database: Object.freeze({
    host: process.env.DB_HOST,
    port: dbPort,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }),

  jwt: Object.freeze({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  }),
});
