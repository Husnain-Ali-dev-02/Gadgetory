import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// initialize PostgreSQL connection pool
// enable SSL when the connection string requires it (e.g. Neon uses `sslmode=require`)
const useSsl = Boolean(
  ENV.DATABASE_URL && ENV.DATABASE_URL.includes("sslmode=require")
) || ENV.NODE_ENV === "production";

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

// log when first connection is made
pool.on("connect", () => {
  console.log("Database connected successfully ✅");
});

// log when an error occurs
pool.on("error", (err) => {
  console.error("💥 Database connection error:", err);
});

export const db = drizzle({ client: pool, schema });

// 👀 What is a Connection Pool?
// A connection pool is a cache of database connections that are kept open and reused.

// 🤷‍♂️ Why use it?
// 🔴 Opening/closing connections is slow. Instead of creating a new connection for each request, we reuse existing ones.
// 🔴 Databases limit concurrent connections. A pool manages a fixed number of connections and shares them across requests.