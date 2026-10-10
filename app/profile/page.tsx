import { requireSession } from "@/lib/auth-config";
import { ProfileAccountCard } from "@/components/profile/ProfileAccountCard";
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";
import { UserAvatar } from "@/components/UserAvatar";

export default async function ProfilePage() {
  const session = await requireSession("প্রোফাইল দেখতে আগে সাইন ইন করুন");
  return (
    <section className="profile-page shell">
      <UserAvatar src={session.user.image} imageClassName="profile-page-avatar" fallbackClassName="profile-page-avatar-wrap profile-page-avatar-fallback" wrapperClassName="profile-page-avatar-wrap" size={64} />
      <div className="profile-heading">
        <h1>আমার প্রোফাইল</h1>
        <p>আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>
      <ProfileAccountCard name={session.user.name} email={session.user.email} image={session.user.image} />
      <section className="profile-info-card" aria-labelledby="profile-info-title">
        <h2 id="profile-info-title">তথ্য</h2>
        <UpdateProfileForm currentName={session.user.name} />
      </section>
    </section>
  );
}
