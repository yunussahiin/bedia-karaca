"use client";

import { Check, AlertCircle } from "lucide-react";

interface BlogMessagesProps {
  success?: boolean;
  successMessage?: string;
  error?: string;
}

export function BlogMessages({
  success,
  successMessage = "Yazı başarıyla kaydedildi!",
  error,
}: BlogMessagesProps) {
  return (
    <>
      {success && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Check className="h-4 w-4" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </>
  );
}
