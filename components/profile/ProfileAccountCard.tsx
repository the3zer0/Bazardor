"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/components/UserAvatar";

interface ProfileAccountCardProps {
  name: string;
  email: string;
  image?: string | null;
}

export function ProfileAccountCard({ name, email, image }: ProfileAccountCardProps) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },
        onError: (context) => { toast.error(context.error.message); },
      },
    });
  }

  return (
    <div className="profile-account-card">
      <UserAvatar src={image} imageClassName="profile-avatar" fallbackClassName="profile-avatar profile-avatar-fallback" size={72} />
      <div className="profile-account-copy">
        <strong>{name}</strong>
        <span>{email}</span>
      </div>
      <button className="profile-signout" type="button" onClick={signOut}>↩ সাইন আউট</button>
    </div>
  );
}
