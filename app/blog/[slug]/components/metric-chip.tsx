import type { ReactNode } from "react";

interface MetricChipProps {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "primary" | "secondary" | "accent" | "info" | "success" | "warning";
}

export function MetricChip({ label, value, icon, tone }: MetricChipProps) {
  const toneStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    info: "bg-blue-500/10 text-blue-600",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/80 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`text-2xl font-bold ${toneStyles[tone]}`}>{value}</p>
    </div>
  );
}
