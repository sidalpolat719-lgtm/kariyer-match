import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-dashed border-ink-200 bg-ink-50/40",
        className
      )}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-white border border-ink-100 shadow-soft flex items-center justify-center text-electric-500 mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-base font-bold text-midnight-950">{title}</h4>
      {description && <p className="text-sm text-ink-600 mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
