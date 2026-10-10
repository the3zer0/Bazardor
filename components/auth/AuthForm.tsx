"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface AuthFormProps {
  mode: "signin" | "signup";
  emailPasswordEnabled: boolean;
  googleEnabled: boolean;
  githubEnabled: boolean;
  message?: string;
  error?: string;
}

export function AuthForm({ mode, emailPasswordEnabled, googleEnabled, githubEnabled, message, error }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (!email || password.length < 8 || (isSignUp && !name)) {
      toast.error(isSignUp ? "নাম, সঠিক ইমেইল ও কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন" : "সঠিক ইমেইল ও কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }
    setLoading(true);
    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        toast.error(result.error.message || "অনুরোধটি সম্পন্ন করা যায়নি");
        return;
      }
      toast.success(isSignUp ? "অ্যাকাউন্ট তৈরি হয়েছে, এখন সাইন ইন করুন" : "স্বাগতম! আপনি সাইন ইন করেছেন");
      router.push(isSignUp ? "/signin" : "/");
      router.refresh();
    } catch {
      toast.error("অ্যাকাউন্ট সেবা এখন সাড়া দিচ্ছে না। পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function social(provider: "google" | "github") {
    const enabled = provider === "google" ? googleEnabled : githubEnabled;
    if (!enabled) {
      toast.error(`${provider === "google" ? "Google" : "GitHub"} সাইন ইন চালু করতে provider credentials configure করুন`);
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/?signin=success",
        errorCallbackURL: "/signin",
      });
      if (result.error) {
        toast.error(result.error.message || "সামাজিক সাইন ইন সম্পন্ন করা যায়নি");
        setLoading(false);
      }
    } catch {
      toast.error("সামাজিক সাইন ইন শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-heading">
        <h1>{isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}</h1>
        <p>{error ? `সাইন ইন সম্পন্ন করা যায়নি: ${error}` : message ?? (isSignUp ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।" : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।")}</p>
      </div>
      <div className={`auth-card ${isSignUp ? "auth-card-signup" : "auth-card-signin"} ${emailPasswordEnabled ? "" : "auth-card-unavailable"}`}>
        {emailPasswordEnabled ? <form onSubmit={submit} className="auth-form">
          {isSignUp && <label>নাম<input name="name" autoComplete="name" placeholder="যেমন: রহিম উদ্দিন" required /></label>}
          <label>ইমেইল<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>পাসওয়ার্ড<input name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} placeholder="কমপক্ষে ৮ অক্ষর" minLength={8} required /></label>
          {isSignUp && <label>পাসওয়ার্ড নিশ্চিত করুন<input name="confirmPassword" type="password" autoComplete="new-password" placeholder="আবার লিখুন" minLength={8} required /></label>}
          <button className="button button-dark auth-submit" disabled={loading} type="submit">{loading ? "অপেক্ষা করুন..." : isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}</button>
        </form> : <div className="auth-unavailable" role="status"><strong>অ্যাকাউন্ট সেবা এখনো চালু হয়নি</strong><p>সাইটের ডাটাবেস সংযোগ কনফিগার করা বাকি। আপাতত বাজারদর দেখা যাবে, তবে সাইন ইন/সাইন আপ করা যাবে না।</p></div>}
        {(googleEnabled || githubEnabled) && emailPasswordEnabled && <div className="auth-divider"><span>অথবা</span></div>}
        {(googleEnabled || githubEnabled) && <div className="social-actions">
          {googleEnabled && <button className="social-button" type="button" disabled={loading} onClick={() => social("google")}>
            <svg className="social-icon" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
              <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
              <path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z" />
              <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z" />
            </svg>
            <span>Google দিয়ে চালিয়ে যান</span>
          </button>}
          {githubEnabled && <button className="social-button" type="button" disabled={loading} onClick={() => social("github")}>
            <svg className="social-icon github-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.2.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.7 1.3 3.3 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.6 4 18.6 4.3 18.6 4.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.3.7 1 .7 2v3.4c0 .4.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>}
        </div>}
        {emailPasswordEnabled && <p className="auth-switch">{isSignUp ? "অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"} <Link href={isSignUp ? "/signin" : "/signup"}>{isSignUp ? "সাইন ইন করুন" : "সাইন আপ করুন"}</Link></p>}
      </div>
      <Link className="auth-home-link" href="/">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}
