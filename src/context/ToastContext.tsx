import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "../lib/cn";

type ToastVariant = "success" | "error" | "info";
interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastCtx {
  push: (t: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback<ToastCtx["push"]>((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value: ToastCtx = {
    push,
    success: (title, description) => push({ title, description, variant: "success" }),
    error: (title, description) => push({ title, description, variant: "error" }),
    info: (title, description) => push({ title, description, variant: "info" }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const Icon = toast.variant === "success" ? CheckCircle2 : toast.variant === "error" ? AlertTriangle : Info;
  const accent =
    toast.variant === "success"
      ? "text-emerald-500"
      : toast.variant === "error"
      ? "text-rose-500"
      : "text-electric-500";

  return (
    <div
      className={cn(
        "glass rounded-2xl p-3 pr-2 flex items-start gap-3 transition-all duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
      role="status"
    >
      <div className={cn("mt-0.5", accent)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-ink-900">{toast.title}</div>
        {toast.description && <div className="text-xs text-ink-600 mt-0.5">{toast.description}</div>}
      </div>
      <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-500" aria-label="Kapat">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
