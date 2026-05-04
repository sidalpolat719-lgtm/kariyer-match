import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-midnight-950/60 backdrop-blur-sm animate-fadeUp"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full bg-white rounded-3xl shadow-deep border border-ink-100 overflow-hidden animate-fadeUp",
            sizes[size]
          )}
        >
          <div className="flex items-start justify-between p-6 pb-3">
            <div>
              {title && <h3 className="text-lg font-bold text-midnight-950">{title}</h3>}
              {description && <p className="text-sm text-ink-600 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-ink-500 hover:bg-ink-100"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 pb-6">{children}</div>
          {footer && <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2 border-t border-ink-100 bg-ink-50/50">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
