import { AuthForm } from "@/components/auth/AuthForm";
import { isAuthPersistenceAvailable } from "@/lib/auth-config";

export const instant = false;

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ message?: string; error?: string; error_description?: string; authUnavailable?: string }> }) {
  const { message, error, error_description: errorDescription, authUnavailable } = await searchParams;
  const oauthError = errorDescription || error;
  const authAvailable = isAuthPersistenceAvailable() && authUnavailable !== "1";
  return <section className="auth-page auth-page-signin"><AuthForm mode="signin" emailPasswordEnabled={authAvailable} googleEnabled={authAvailable && Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim())} githubEnabled={authAvailable && Boolean(process.env.GITHUB_CLIENT_ID?.trim() && process.env.GITHUB_CLIENT_SECRET?.trim())} message={message} error={oauthError} /></section>;
}
