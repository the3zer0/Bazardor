"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function UpdateProfileForm({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  async function selectPhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("একটি ছবি নির্বাচন করুন"); return; }
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("ছবি পড়া যায়নি");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      if (dataUrl.length > 700_000) throw new Error("ছবিটি ছোট করে আবার চেষ্টা করুন");
      setImage(dataUrl);
      setPreview(dataUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ছবি আপলোড করা যায়নি");
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) { toast.error("নাম খালি রাখা যাবে না"); return; }
    setLoading(true);
    const result = await authClient.updateUser({ name: name.trim(), ...(image ? { image } : {}) });
    setLoading(false);
    if (result.error) toast.error(result.error.message || "নাম আপডেট করা যায়নি");
    else { toast.success("প্রোফাইল আপডেট হয়েছে"); setImage(""); router.refresh(); }
  }
  return (
    <form className="profile-form" onSubmit={submit}>
      <label>প্রোফাইল ছবি
        <span className="profile-photo-control">
          {preview && <Image className="profile-photo-preview" src={preview} alt="নির্বাচিত প্রোফাইল ছবির প্রিভিউ" width={56} height={56} unoptimized />}
          <input type="file" accept="image/*" onChange={(event) => void selectPhoto(event.target.files?.[0])} />
        </span>
      </label>
      <label>নাম<input value={name} onChange={(event) => setName(event.target.value)} /></label>
      <button className="button button-dark" disabled={loading} type="submit">{loading ? "সংরক্ষণ হচ্ছে..." : "আপডেট"}</button>
    </form>
  );
}
