import { NavLink } from "react-router-dom";
import { LayoutDashboard, Sparkles, MessageCircle, User, ListChecks } from "lucide-react";
import { cn } from "../../lib/cn";

const items = [
  { to: "/app", label: "Ana", icon: LayoutDashboard, end: true },
  { to: "/app/matches", label: "Eşleşme", icon: Sparkles },
  { to: "/app/applications", label: "Başvuru", icon: ListChecks },
  { to: "/app/messages", label: "Mesaj", icon: MessageCircle },
  { to: "/app/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-ink-100 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition",
                  isActive ? "text-electric-600" : "text-ink-500"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "w-10 h-7 flex items-center justify-center rounded-xl transition",
                      isActive && "bg-electric-50"
                    )}
                  >
                    <it.icon className="w-5 h-5" />
                  </span>
                  {it.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
