import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { envConfig } from "../config";

const sql = neon(envConfig.DB_URL);
export const db = drizzle(sql);
