import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "neutral" | "primary" | "purple" | "emerald" | "amber" | "rose" | "ink";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  icon?: ReactNode;
  size?: "sm" | "md";
}

const toneStyles: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  primary: "bg-electric-50 text-electric-700",
  purple: "bg-royal-50 text-royal-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  ink: "bg-midnight-900 text-white",
};

export function Badge({ children, tone = "neutral", className, icon, size = "sm" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
        toneStyles[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
