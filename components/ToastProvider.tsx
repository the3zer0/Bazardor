"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export function ToastProvider() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const signedIn = url.searchParams.get("signin") === "success";
    const redirectMessage = url.searchParams.get("message");
    const authError = url.searchParams.get("error_description") || url.searchParams.get("error");

    if (signedIn) {
      toast.success("স্বাগতম! আপনি সাইন ইন করেছেন");
    } else if (authError) {
      toast.error(`সাইন ইন সম্পন্ন করা যায়নি: ${authError}`);
    } else if (redirectMessage) {
      toast(redirectMessage, { icon: "ℹ️" });
    } else {
      return;
    }

    url.searchParams.delete("signin");
    url.searchParams.delete("message");
    url.searchParams.delete("error");
    url.searchParams.delete("error_description");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  return <Toaster position="top-center" toastOptions={{ duration: 3500 }} />;
}
