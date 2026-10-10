import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProfile = path.startsWith("/profile");
  const hasSessionCookie = request.cookies
    .getAll()
    .some(({ name }) => name.toLowerCase().includes("session_token"));

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set(
    "message",
    isProfile
      ? "প্রোফাইল দেখতে আগে সাইন ইন করুন"
      : "পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন",
  );

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
