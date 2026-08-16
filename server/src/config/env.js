import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),

  DATABASE_HOST: z.string().min(1),

  DATABASE_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3306),

  DATABASE_NAME: z.string().min(1),

  DATABASE_USER: z.string().min(1),

  DATABASE_PASSWORD: z.string(),

  JWT_SECRET: z
    .string()
    .min(32),

  JWT_EXPIRES_IN: z
    .string()
    .min(1)
    .default("15m"),

  CORS_ORIGINS: z.string().default(
    "http://localhost:5173",
  ),

  LOG_LEVEL: z
    .enum([
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
    ])
    .default("info"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment configuration:",
  );

  console.error(
    result.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = result.data;