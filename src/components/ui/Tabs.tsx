import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs({ tabs, active, onChange, className, size = "md" }: TabsProps) {
  return (
    <div className={cn("inline-flex p-1 rounded-xl bg-ink-100/70", className)}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg font-semibold transition",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              isActive
                ? "bg-white shadow-soft text-midnight-950"
                : "text-ink-600 hover:text-midnight-900"
            )}
          >
            {t.icon}
            {t.label}
            {typeof t.badge === "number" && (
              <span
                className={cn(
                  "ml-1 inline-flex min-w-[20px] h-5 px-1.5 items-center justify-center rounded-full text-[10px] font-bold",
                  isActive ? "bg-electric-500 text-white" : "bg-ink-200 text-ink-700"
                )}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
