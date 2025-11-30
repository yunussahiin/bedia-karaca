import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const surfaceStyles = cva(
  "relative overflow-hidden rounded-3xl border shadow-sm transition-transform duration-300 will-change-transform",
  {
    variants: {
      tone: {
        neutral: "bg-card/90 border-border/70",
        soft: "border-border/60 bg-gradient-to-br from-[color:var(--sand-50)] via-card to-[color:var(--brand-50)] dark:from-[color:var(--sand-900)] dark:via-background dark:to-[color:var(--brand-200)]",
        accent:
          "border-primary/30 bg-gradient-to-br from-primary/15 via-background to-[color:var(--sand-50)] dark:from-primary/20 dark:via-background dark:to-[color:var(--brand-100)]",
        muted: "border-dashed border-border/60 bg-muted/60",
        glass: "border-border/50 bg-background/70 backdrop-blur-xl",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      lift: {
        true: "hover:-translate-y-1 hover:shadow-lg",
      },
    },
    defaultVariants: {
      tone: "neutral",
      padding: "md",
    },
  },
);

type SurfaceProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof surfaceStyles>;

export function Surface({
  tone,
  padding,
  lift,
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(surfaceStyles({ tone, padding, lift, className }))}
      {...props}
    >
      {children}
    </div>
  );
}

type SectionHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  kicker,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-3", alignment, className)}>
      {kicker ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-border/60">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          {kicker}
        </span>
      ) : null}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-base text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}
