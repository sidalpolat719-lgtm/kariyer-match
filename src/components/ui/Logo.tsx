import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

export function Logo({
  to = "/",
  variant = "dark",
  className,
}: {
  to?: string;
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2.5 group", className)}>
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-grad-primary shadow-glow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 18 L10 8 L14 14 L20 4"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="4" r="2" fill="#22d3ee" />
        </svg>
      </span>
      <span
        className={cn(
          "font-extrabold tracking-tight text-lg",
          variant === "dark" ? "text-midnight-950" : "text-white"
        )}
      >
        Path<span className="text-gradient">Match</span>
      </span>
    </Link>
  );
}
