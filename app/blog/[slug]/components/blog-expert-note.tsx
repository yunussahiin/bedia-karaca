"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface BlogExpertNoteProps {
  expertNote?: string;
  authorName?: string;
  authorBio?: string;
  authorAvatar?: string;
}

const DEFAULT_AVATAR =
  "https://nztcblkytmaxartdvhoj.supabase.co/storage/v1/object/public/avatars/author-1764449943538.jpg";

export function BlogExpertNote({
  expertNote,
  authorName = "Bedia Kalemzer Karaca",
  authorBio = "Klinik Psikolog",
  authorAvatar,
}: BlogExpertNoteProps) {
  if (!expertNote) return null;

  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const avatarSrc = authorAvatar || DEFAULT_AVATAR;

  return (
    <div className="relative my-8 overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 dark:border-emerald-800 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30">
      {/* Decorative Quote */}
      <Quote className="absolute -right-4 -top-4 h-24 w-24 rotate-180 text-emerald-100 dark:text-emerald-900/50" />

      <div className="relative flex items-start gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-emerald-200 dark:ring-emerald-700">
          <AvatarImage src={avatarSrc} alt={authorName} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold dark:bg-emerald-900 dark:text-emerald-300">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-2">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              Uzman Notu
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {authorName}, {authorBio}
            </p>
          </div>

          <blockquote className="text-emerald-800 dark:text-emerald-200 leading-relaxed italic">
            &ldquo;{expertNote}&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
