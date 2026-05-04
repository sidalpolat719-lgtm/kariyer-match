import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "dark" | "outline" | "ghost" | "soft" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "text-white bg-grad-cta shadow-glow hover:brightness-105 active:scale-[0.98]",
  dark: "text-white bg-midnight-900 hover:bg-midnight-800 active:scale-[0.98]",
  outline:
    "text-midnight-900 bg-white border border-ink-200 hover:border-midnight-900 hover:bg-ink-50 active:scale-[0.98]",
  ghost: "text-ink-700 hover:bg-ink-100",
  soft: "text-electric-700 bg-electric-50 hover:bg-electric-100",
  danger: "text-white bg-rose-500 hover:bg-rose-600 active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading,
    iconLeft,
    iconRight,
    fullWidth,
    children,
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "btn font-semibold",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
});
