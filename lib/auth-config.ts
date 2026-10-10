import { headers } from "next/headers";
import { redirect } from "next/navigation";

export function isAuthPersistenceAvailable() {
  return true;
}

export async function requireSession(message: string) {
  let session;
  try {
    const { auth } = await import("@/lib/auth");
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    redirect(
      `/signin?message=${encodeURIComponent("অ্যাকাউন্ট সেবা এখনো চালু হয়নি")}&authUnavailable=1`,
    );
  }
  if (!session) redirect(`/signin?message=${encodeURIComponent(message)}`);
  return session;
}
