import { createAuthClient } from "better-auth/react";

// Let Better Auth use the current origin's /api/auth endpoint. A localhost
// fallback here makes deployed browsers request the visitor's own computer.
export const authClient = createAuthClient();
