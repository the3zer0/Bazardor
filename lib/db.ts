import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (Boolean(tursoUrl) !== Boolean(tursoAuthToken)) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured together.");
}

const client = createClient(
  tursoUrl && tursoAuthToken
    ? { url: tursoUrl, authToken: tursoAuthToken }
    : { url: `file:${process.env.BETTER_AUTH_DB_PATH ?? "auth.db"}` },
);

export const db = drizzle(client);

let schemaSetup: Promise<void> | undefined;

/** Create Better Auth's core SQLite tables on first use, including on a new Turso database. */
export function ensureAuthSchema() {
  if (!schemaSetup) {
    schemaSetup = client
      .batch(
        [
          `CREATE TABLE IF NOT EXISTS "user" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL UNIQUE,
            "email_verified" INTEGER NOT NULL,
            "image" TEXT,
            "created_at" INTEGER NOT NULL,
            "updated_at" INTEGER NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS "session" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "expires_at" INTEGER NOT NULL,
            "token" TEXT NOT NULL UNIQUE,
            "created_at" INTEGER NOT NULL,
            "updated_at" INTEGER NOT NULL,
            "ip_address" TEXT,
            "user_agent" TEXT,
            "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
          )`,
          `CREATE TABLE IF NOT EXISTS "account" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "account_id" TEXT NOT NULL,
            "provider_id" TEXT NOT NULL,
            "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
            "access_token" TEXT,
            "refresh_token" TEXT,
            "id_token" TEXT,
            "access_token_expires_at" INTEGER,
            "refresh_token_expires_at" INTEGER,
            "scope" TEXT,
            "password" TEXT,
            "created_at" INTEGER NOT NULL,
            "updated_at" INTEGER NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS "verification" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "identifier" TEXT NOT NULL,
            "value" TEXT NOT NULL,
            "expires_at" INTEGER NOT NULL,
            "created_at" INTEGER,
            "updated_at" INTEGER
          )`,
        ],
        "write",
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        schemaSetup = undefined;
        throw error;
      });
  }

  return schemaSetup;
}
