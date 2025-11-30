"use client";

import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SESSION_TYPES, type SessionType } from "@/lib/services/appointments";

interface SessionTypeSelectorProps {
  value: SessionType | null;
  onChange: (type: SessionType) => void;
  error?: string;
}

export function SessionTypeSelector({
  value,
  onChange,
  error,
}: SessionTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Seans Türü *</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {SESSION_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              "group relative rounded-xl border-2 p-4 text-left transition-all hover:border-emerald-400 hover:shadow-md",
              value === type.value
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-border/60 bg-background"
            )}
          >
            {value === type.value && (
              <div className="absolute right-2 top-2">
                <IconCheck className="h-4 w-4 text-emerald-600" />
              </div>
            )}
            <p className="font-semibold text-slate-900 dark:text-white">
              {type.title}
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              {type.duration}
            </p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {type.desc}
            </p>
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
