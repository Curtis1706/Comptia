"use client";

import React, { useState } from "react";
import BoringAvatar from "boring-avatars";
import { cn } from "@/lib/utils";

// Palette officielle Ceilow (Tokens stricts)
export const CEILOW_AVATAR_PALETTE = [
  "#332E29", // Ink (Brun foncé)
  "#FFD946", // Primary (Jaune Ceilow)
  "#5FFFC2", // Success (Vert menthe)
  "#FFA53D", // Warning (Ambre)
  "#F5F4F2", // Background Secondary (Gris clair)
];

export interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: number;
  variant?: "beam" | "marble" | "pixel" | "sunset" | "bauhaus" | "ring";
  className?: string;
  square?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  avatarUrl,
  size = 32,
  variant = "beam",
  className,
  square = false,
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  // Seed déterministe pour que le même utilisateur conserve toujours le même avatar
  const seed = (name?.trim() || email?.trim() || "user").toLowerCase();

  const containerClasses = cn(
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-border/40 bg-background-secondary shadow-xs",
    square ? "rounded-lg" : "rounded-full",
    className
  );

  if (avatarUrl && !hasImageError) {
    return (
      <div
        className={containerClasses}
        style={{ width: size, height: size }}
      >
        <img
          src={avatarUrl}
          alt={name || "Avatar utilisateur"}
          onError={() => setHasImageError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={{ width: size, height: size }}
      title={name || email || undefined}
    >
      <BoringAvatar
        size={size}
        name={seed}
        variant={variant}
        colors={CEILOW_AVATAR_PALETTE}
        square={square}
      />
    </div>
  );
};
