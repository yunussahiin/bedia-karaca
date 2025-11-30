"use client";

import { IconVideo, IconUsers } from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TherapyChannel } from "@/lib/services/appointments";

interface TherapyChannelSelectorProps {
  value: TherapyChannel;
  onChange: (channel: TherapyChannel) => void;
}

export function TherapyChannelSelector({
  value,
  onChange,
}: TherapyChannelSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Terapi Kanalı *</p>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as TherapyChannel)}
        className="grid grid-cols-2 gap-4"
      >
        <Label
          htmlFor="zoom"
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all hover:border-emerald-400",
            value === "zoom"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
              : "border-border/60"
          )}
        >
          <RadioGroupItem value="zoom" id="zoom" />
          <IconVideo className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-medium">Zoom (Online)</p>
            <p className="text-xs text-muted-foreground">Evden katılım</p>
          </div>
        </Label>
        <Label
          htmlFor="yuz_yuze"
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all hover:border-emerald-400",
            value === "yuz_yuze"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
              : "border-border/60"
          )}
        >
          <RadioGroupItem value="yuz_yuze" id="yuz_yuze" />
          <IconUsers className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-medium">Yüz Yüze</p>
            <p className="text-xs text-muted-foreground">Nişantaşı/Şişli</p>
          </div>
        </Label>
      </RadioGroup>
    </div>
  );
}
