import Link from "next/link";

export const instant = false;

export default function NotFound() {
  return <section className="shell not-found"><p className="section-kicker">পাতাটি খুঁজে পাওয়া যায়নি</p><h1>এই বাজারের ঠিকানা নেই</h1><p>লিংকটি হয়তো বদলে গেছে। বাজার দর হোম পেজে ফিরে চলুন।</p><Link className="button button-dark" href="/">হোম পেজে ফিরে যান</Link></section>;
}