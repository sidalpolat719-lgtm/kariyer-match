import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Briefcase,
  GitBranch,
  CalendarRange,
  BarChart3,
  Inbox,
  Building2,
  UsersRound,
  CreditCard,
  Settings2,
  Sparkles,
  LogOut,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { cn } from "../../lib/cn";
import { Link } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "İŞE ALIM",
    items: [
      { to: "/company", label: "Genel Bakış", icon: <LayoutGrid className="w-[18px] h-[18px]" /> },
      { to: "/company/talent", label: "Aday Havuzu", icon: <Users className="w-[18px] h-[18px]" />, badge: "248" },
      { to: "/company/postings", label: "İlanlarım", icon: <Briefcase className="w-[18px] h-[18px]" />, badge: "6" },
      { to: "/company/pipeline", label: "Aday Pipeline", icon: <GitBranch className="w-[18px] h-[18px]" /> },
      { to: "/company/interviews", label: "Mülakatlar", icon: <CalendarRange className="w-[18px] h-[18px]" />, badge: "5" },
    ],
  },
  {
    title: "ANALİTİK & MARKA",
    items: [
      { to: "/company/analytics", label: "Talent Analitiği", icon: <BarChart3 className="w-[18px] h-[18px]" /> },
      { to: "/company/brand", label: "Şirket Sayfası", icon: <Building2 className="w-[18px] h-[18px]" /> },
      { to: "/company/messages", label: "Aday Mesajları", icon: <Inbox className="w-[18px] h-[18px]" />, badge: "3" },
    ],
  },
  {
    title: "ORGANİZASYON",
    items: [
      { to: "/company/team", label: "Ekibim", icon: <UsersRound className="w-[18px] h-[18px]" /> },
      { to: "/company/billing", label: "Faturalandırma", icon: <CreditCard className="w-[18px] h-[18px]" /> },
      { to: "/company/settings", label: "Ayarlar", icon: <Settings2 className="w-[18px] h-[18px]" /> },
    ],
  },
];

interface Props {
  open?: boolean;
  onClose?: () => void;
  onNewPosting?: () => void;
}

export function CompanySidebar({ open, onClose, onNewPosting }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-midnight-950/60 backdrop-blur-sm z-40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-[100dvh] w-[268px] flex flex-col transition-transform duration-300 text-white",
          "bg-midnight-950 border-r border-white/5",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          backgroundImage:
            "linear-gradient(180deg, #070f24 0%, #0d1a3a 60%, #1d2750 100%)",
        }}
      >
        {/* Brand */}
        <div className="px-5 h-16 flex items-center border-b border-white/5">
          <Link to="/company" className="inline-flex items-center gap-2.5 group">
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)]"
              style={{ background: "linear-gradient(135deg,#8b5cf6 0%, #d946ef 100%)" }}
            >
              <Building2 className="w-4 h-4 text-white" />
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold text-white tracking-tight">PathMatch</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-royal-300">
                for Business
              </div>
            </div>
          </Link>
        </div>

        {/* Workspace switcher */}
        <div className="p-3">
          <button
            onClick={() => toast.info("Birden fazla şirket desteği yakında")}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-grad-corp-cta flex items-center justify-center text-white font-bold">
              NL
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="text-sm font-bold text-white truncate">Nova Labs</div>
              <div className="text-[11px] text-white/50 truncate">Growth Plan · 80 kişi</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/40">
              <path d="M7 9l5 6 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onNewPosting?.()}
          className="mx-3 mb-3 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)] hover:brightness-110 transition"
          style={{ background: "linear-gradient(135deg,#8b5cf6 0%, #d946ef 100%)" }}
        >
          <Plus className="w-4 h-4" /> Yeni İlan Oluştur
        </button>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-2">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/company"}
                      onClick={() => onClose?.()}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all relative",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                              style={{
                                background:
                                  "linear-gradient(180deg,#8b5cf6 0%, #d946ef 100%)",
                              }}
                            />
                          )}
                          <span className="shrink-0 ml-1">{item.icon}</span>
                          <span className="truncate flex-1">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                isActive
                                  ? "bg-royal-500/30 text-white"
                                  : "bg-white/5 text-white/60"
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

        {/* Footer card */}
        <div className="p-3 border-t border-white/5">
          <div
            className="rounded-2xl p-3.5 border border-white/10 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(217,70,239,0.18) 100%)",
            }}
          >
            <Sparkles className="w-4 h-4 text-royal-300 mb-1.5" />
            <div className="text-sm font-bold text-white">Enterprise'a yükselt</div>
            <p className="text-[11px] text-white/70 mt-1 leading-snug">
              Sınırsız ilan, AI destekli kaynak bulma ve özel hesap yöneticisi.
            </p>
            <button
              onClick={() => toast.info("Satış ekibi sizinle iletişime geçecek")}
              className="mt-2 w-full text-[11px] font-bold py-1.5 rounded-lg bg-white text-midnight-950 hover:bg-white/90 transition"
            >
              Satışla Görüş
            </button>
          </div>
          <button
            onClick={() => {
              logout();
              toast.success("Çıkış yapıldı");
              navigate("/");
            }}
            className="mt-3 w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
