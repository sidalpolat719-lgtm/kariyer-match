import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  padded?: boolean;
}

export function Card({ children, className, interactive, padded = true, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-ink-100 rounded-2xl shadow-soft",
        interactive && "card-hover cursor-pointer",
        padded && "p-5",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-midnight-950 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-ink-600 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}
