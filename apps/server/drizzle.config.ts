import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DB_URL = process.env.DB_URL!;
console.log(DB_URL);

export default defineConfig({
  out: "./drizzle",
  schema: ["./db/schema"],
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
});
