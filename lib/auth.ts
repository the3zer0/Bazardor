import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import * as schema from "@/lib/auth-schema";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();
const baseURL =
  process.env.BETTER_AUTH_URL?.trim() ||
  "http://localhost:3000";
const secret = process.env.BETTER_AUTH_SECRET?.trim();

if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("BETTER_AUTH_SECRET must be configured in production.");
}

const socialProviders = {
  ...(googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          redirectURI: `${baseURL}/api/auth/callback/google`,
          scope: ["openid", "email", "profile"],
          prompt: "select_account" as const,
        },
      }
    : {}),
  ...(githubClientId && githubClientSecret
    ? {
        github: {
          clientId: githubClientId,
          clientSecret: githubClientSecret,
          redirectURI: `${baseURL}/api/auth/callback/github`,
          scope: ["read:user", "user:email"],
        },
      }
    : {}),
};

export const auth = betterAuth({
  secret: secret || "development-only-change-this-secret",
  baseURL,
  onAPIError: {
    errorURL: `${baseURL}/signin`,
  },
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  plugins: [nextCookies()],
});
