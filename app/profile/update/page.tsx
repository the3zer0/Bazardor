import { requireSession } from "@/lib/auth-config";
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";

export default async function UpdateProfilePage() {
  const session = await requireSession("প্রোফাইল আপডেট করতে আগে সাইন ইন করুন");
  return <section className="section shell profile-page"><p className="section-kicker">অ্যাকাউন্ট সেটিংস</p><h1>প্রোফাইল আপডেট করুন</h1><p className="profile-email">আপনার নাম পরিবর্তন করুন। ইমেইল: {session.user.email}</p><UpdateProfileForm currentName={session.user.name} /></section>;
}
