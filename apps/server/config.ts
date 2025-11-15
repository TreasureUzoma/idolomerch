import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  APP_URL: z.string(),
  DB_URL: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  ENCRYPTION_KEY: z.string(),
  EXCHANGE_RATE_API_KEY: z.string(),
  REDIS_URL: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
});

export const envConfig = envSchema.parse(process.env);
