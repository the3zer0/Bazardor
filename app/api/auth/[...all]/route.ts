async function handle(request: Request) {
  try {
    const [{ auth }, { ensureAuthSchema }] = await Promise.all([
      import("@/lib/auth"),
      import("@/lib/db"),
    ]);
    await ensureAuthSchema();
    return await auth.handler(request);
  } catch {
    return Response.json(
      { code: "AUTH_STORAGE_UNAVAILABLE", message: "Authentication storage is unavailable." },
      { status: 503 },
    );
  }
}

export const GET = handle;
export const POST = handle;
