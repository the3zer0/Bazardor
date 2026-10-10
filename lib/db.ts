import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: `file:${process.env.BETTER_AUTH_DB_PATH ?? "auth.db"}`,
});

export const db = drizzle(client);
