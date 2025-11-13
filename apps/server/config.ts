import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.string(),
  DB_URL: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3005),
  ENCRYPTION_KEY: z.string(),
});

export const envConfig = envSchema.parse(process.env);
