"use client";

import Image from "next/image";
import { useState } from "react";
import { AvatarPlaceholder } from "@/components/AvatarPlaceholder";

interface UserAvatarProps {
  src?: string | null;
  imageClassName: string;
  fallbackClassName: string;
  wrapperClassName?: string;
  size: number;
}

export function UserAvatar({ src, imageClassName, fallbackClassName, wrapperClassName, size }: UserAvatarProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = src?.trim() || null;

  if (!source || source === failedSource) {
    return <AvatarPlaceholder className={fallbackClassName} />;
  }

  const image = (
    <Image
      className={imageClassName}
      src={source}
      alt=""
      width={size}
      height={size}
      unoptimized
      onError={() => setFailedSource(source)}
    />
  );

  return wrapperClassName ? <span className={wrapperClassName}>{image}</span> : image;
}
