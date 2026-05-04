import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, Briefcase, CalendarRange, Inbox } from "lucide-react";
import { cn } from "../../lib/cn";

const items = [
  { to: "/company", label: "Genel", icon: LayoutGrid, end: true },
  { to: "/company/talent", label: "Adaylar", icon: Users },
  { to: "/company/postings", label: "İlanlar", icon: Briefcase },
  { to: "/company/interviews", label: "Mülakat", icon: CalendarRange },
  { to: "/company/messages", label: "Mesaj", icon: Inbox },
];

export function CompanyBottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 pb-[env(safe-area-inset-bottom)]"
      style={{
        backgroundImage: "linear-gradient(180deg,#0d1a3a 0%, #070f24 100%)",
      }}
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition",
                  isActive ? "text-white" : "text-white/50"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "w-10 h-7 flex items-center justify-center rounded-xl transition",
                      isActive && "bg-white/10"
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
