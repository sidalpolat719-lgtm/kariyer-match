import { cn } from "../../lib/cn";

interface ProgressBarProps {
  value: number;
  className?: string;
  showValue?: boolean;
  label?: string;
  tone?: "primary" | "purple" | "emerald";
}

const toneBg: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  primary: "bg-grad-cta",
  purple: "bg-gradient-to-r from-royal-500 to-royal-700",
  emerald: "bg-gradient-to-r from-emerald-400 to-emerald-600",
};

export function ProgressBar({
  value,
  className,
  showValue,
  label,
  tone = "primary",
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-semibold text-ink-700">{label}</span>}
          {showValue && <span className="text-xs font-bold text-midnight-950">{v}%</span>}
        </div>
      )}
      <div className="h-2 w-full bg-ink-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", toneBg[tone])}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
