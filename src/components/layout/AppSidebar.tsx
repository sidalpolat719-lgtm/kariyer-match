import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  ListChecks,
  Map,
  MessageCircle,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Bookmark,
  Trophy,
} from "lucide-react";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/cn";
import { useToast } from "../../context/ToastContext";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const studentSections: NavSection[] = [
  {
    title: "KARİYERİM",
    items: [
      { to: "/app", label: "Dashboard", icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
      { to: "/app/matches", label: "Sana Özel Eşleşmeler", icon: <Sparkles className="w-[18px] h-[18px]" />, badge: "12" },
      { to: "/app/internships", label: "Stajlar & İşler", icon: <Briefcase className="w-[18px] h-[18px]" /> },
      { to: "/app/saved", label: "Kaydedilenler", icon: <Bookmark className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: "BAŞVURU & GELİŞİM",
    items: [
      { to: "/app/applications", label: "Başvurularım", icon: <ListChecks className="w-[18px] h-[18px]" />, badge: "5" },
      { to: "/app/roadmap", label: "Kariyer Yol Haritam", icon: <Map className="w-[18px] h-[18px]" /> },
      { to: "/app/mentors", label: "Mentorlar", icon: <Trophy className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: "HESAP",
    items: [
      { to: "/app/messages", label: "Mesajlar", icon: <MessageCircle className="w-[18px] h-[18px]" />, badge: "3" },
      { to: "/app/profile", label: "Profilim", icon: <User className="w-[18px] h-[18px]" /> },
      { to: "/app/settings", label: "Ayarlar", icon: <Settings className="w-[18px] h-[18px]" /> },
    ],
  },
];

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-midnight-950/50 backdrop-blur-sm z-40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-[100dvh] w-[268px] bg-white border-r border-ink-100 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-5 h-16 flex items-center border-b border-ink-100">
          <Logo />
        </div>

        {/* User card */}
        <div className="p-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-grad-soft border border-electric-100">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: user?.avatarColor || "#06b6d4" }}
            >
              {user?.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "ÖĞ"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-midnight-950 truncate">
                {user?.fullName || "Öğrenci"}
              </div>
              <div className="text-[10px] text-electric-700 font-bold uppercase tracking-wider inline-flex items-center gap-1">
                <GraduationCap className="w-2.5 h-2.5" /> Öğrenci · Boğaziçi Üni.
              </div>
            </div>
          </div>
        </div>

        {/* Profile strength bar */}
        <div className="px-3 pb-3">
          <div className="rounded-xl p-3 border border-ink-100 bg-white">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-semibold text-ink-700">Profil Gücü</span>
              <span className="font-bold text-electric-700">%76</span>
            </div>
            <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: "76%",
                  background: "linear-gradient(90deg,#22d3ee,#7c3aed)",
                }}
              />
            </div>
            <button
              onClick={() => navigate("/app/profile")}
              className="mt-2 text-[11px] font-semibold text-electric-700 hover:text-electric-800"
            >
              Profili Güçlendir →
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
          {studentSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400 mb-2">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/app"}
                      onClick={() => onClose?.()}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all",
                          isActive
                            ? "bg-grad-cta text-white shadow-glow"
                            : "text-ink-700 hover:bg-ink-100 hover:text-midnight-950"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="shrink-0">{item.icon}</span>
                          <span className="truncate flex-1">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-electric-50 text-electric-700"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-100">
          <div className="rounded-2xl p-3 bg-grad-soft border border-electric-100 relative overflow-hidden">
            <Sparkles className="w-4 h-4 text-electric-700 mb-1.5" />
            <div className="text-[11px] uppercase tracking-wider font-bold text-electric-700">
              Premium
            </div>
            <p className="text-xs text-ink-700 mt-1 leading-snug">
              Mentorlara sınırsız erişim ve öncelikli eşleşme.
            </p>
            <button
              className="mt-2 w-full text-xs font-semibold py-1.5 rounded-lg bg-midnight-950 text-white hover:bg-midnight-900"
              onClick={() => toast.info("Premium yakında")}
            >
              Premium'u Keşfet
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              toast.success("Çıkış yapıldı");
              navigate("/");
            }}
            className="mt-3 w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-ink-600 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
