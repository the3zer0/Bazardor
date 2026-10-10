import { AuthForm } from "@/components/auth/AuthForm";
import { isAuthPersistenceAvailable } from "@/lib/auth-config";

export const instant = false;

export default function SignUpPage() {
  const authAvailable = isAuthPersistenceAvailable();
  return <section className="auth-page auth-page-signup"><AuthForm mode="signup" emailPasswordEnabled={authAvailable} googleEnabled={authAvailable && Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim())} githubEnabled={authAvailable && Boolean(process.env.GITHUB_CLIENT_ID?.trim() && process.env.GITHUB_CLIENT_SECRET?.trim())} /></section>;
}
