import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  Building2,
  CalendarRange,
  CreditCard,
  HelpCircle,
  Inbox,
  Menu,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useCompanyData } from "../../context/CompanyDataContext";
import { cn } from "../../lib/cn";

interface Props {
  onMenu: () => void;
  onNewPosting: () => void;
}

export function CompanyTopbar({ onMenu, onNewPosting }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { talent, postings, conversations, team } = useCompanyData();

  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  const refSearch = useRef<HTMLDivElement>(null);
  const refNotif = useRef<HTMLDivElement>(null);
  const refProfile = useRef<HTMLDivElement>(null);
  const refHelp = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (refSearch.current && !refSearch.current.contains(e.target as Node)) setOpenSearch(false);
      if (refNotif.current && !refNotif.current.contains(e.target as Node)) setOpenNotif(false);
      if (refProfile.current && !refProfile.current.contains(e.target as Node)) setOpenProfile(false);
      if (refHelp.current && !refHelp.current.contains(e.target as Node)) setOpenHelp(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const candidateResults = search
    ? talent
        .filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
        )
        .slice(0, 4)
    : [];
  const postingResults = search
    ? postings
        .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 3)
    : [];

  const unreadMessages = conversations.reduce((s, c) => s + c.unread, 0);

  const notifications = [
    { t: "Ada Yılmaz mülakat davetini onayladı", time: "2 dk", type: "interview" as const },
    { t: "Frontend Stajyer ilanına 4 yeni başvuru", time: "10 dk", type: "match" as const },
    { t: "Ece Demir teklifinizi inceledi", time: "1 sa", type: "offer" as const },
    { t: "Aylık talent raporunuz hazır", time: "Dün", type: "report" as const },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-ink-100">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-ink-100"
          onClick={onMenu}
          aria-label="Menü"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search */}
        <div ref={refSearch} className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenSearch(true);
            }}
            onFocus={() => setOpenSearch(true)}
            placeholder="Aday, yetenek veya ilan ara…"
            className="w-full pl-10 pr-20 py-2.5 text-sm bg-ink-50/80 border border-transparent rounded-xl outline-none focus:bg-white focus:border-royal-300 focus:ring-4 focus:ring-royal-100"
          />
          <kbd className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] font-bold text-ink-500 bg-white border border-ink-200 px-1.5 py-0.5 rounded-md">
            ⌘ K
          </kbd>

          {openSearch && search && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ink-100 rounded-2xl shadow-deep overflow-hidden z-50">
              <div className="max-h-96 overflow-y-auto">
                {candidateResults.length > 0 && (
                  <div>
                    <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-400">
                      Adaylar
                    </div>
                    {candidateResults.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          navigate("/company/talent");
                          setOpenSearch(false);
                          setSearch("");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-ink-50 text-left"
                      >
                        <Avatar name={c.name} color={c.avatarColor} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-midnight-950 truncate">
                            {c.name}
                          </div>
                          <div className="text-xs text-ink-500 truncate">{c.headline}</div>
                        </div>
                        <span className="text-xs font-bold text-royal-700 bg-royal-50 px-2 py-0.5 rounded-md">
                          %{c.matchScore}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {postingResults.length > 0 && (
                  <div className="border-t border-ink-100">
                    <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-400">
                      İlanlar
                    </div>
                    {postingResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          navigate("/company/postings");
                          setOpenSearch(false);
                          setSearch("");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-ink-50 text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-royal-50 text-royal-700 flex items-center justify-center">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-midnight-950 truncate">
                            {p.title}
                          </div>
                          <div className="text-xs text-ink-500 truncate">
                            {p.department} · {p.applicants} başvuru
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {candidateResults.length === 0 && postingResults.length === 0 && (
                  <div className="p-6 text-center text-sm text-ink-500">Sonuç bulunamadı.</div>
                )}
              </div>
              <div className="border-t border-ink-100 px-3 py-2 bg-ink-50/50 flex items-center justify-between">
                <span className="text-[11px] text-ink-500">Hızlı kısayollar</span>
                <button
                  onClick={() => {
                    navigate("/company/talent");
                    setOpenSearch(false);
                  }}
                  className="text-xs font-semibold text-royal-700 hover:text-royal-800"
                >
                  Tüm sonuçlar →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick action */}
        <button
          onClick={onNewPosting}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-[0_10px_30px_-12px_rgba(139,92,246,0.5)] hover:brightness-105 transition"
          style={{ background: "linear-gradient(135deg,#8b5cf6 0%, #d946ef 100%)" }}
        >
          <Plus className="w-4 h-4" /> Yeni İlan
        </button>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          {/* Team avatars */}
          <div className="hidden lg:flex items-center -space-x-2 mr-2">
            {team.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  navigate("/company/team");
                  toast.info(`${m.name}`);
                }}
                title={m.name}
                className="ring-2 ring-white rounded-full hover:scale-110 transition"
              >
                <Avatar name={m.name} color={m.avatarColor} size="xs" />
              </button>
            ))}
            <button
              onClick={() => navigate("/company/team")}
              className="w-7 h-7 rounded-full ring-2 ring-white bg-ink-100 text-ink-700 text-[10px] font-bold inline-flex items-center justify-center hover:bg-ink-200"
            >
              +{Math.max(0, team.length - 4)}
            </button>
          </div>

          {/* Help */}
          <div ref={refHelp} className="relative hidden sm:block">
            <button
              onClick={() => setOpenHelp((v) => !v)}
              className="p-2.5 rounded-xl text-ink-700 hover:bg-ink-100"
              aria-label="Yardım"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            {openHelp && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-deep border border-ink-100 overflow-hidden z-50 p-2">
                <DropdownItem
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Ürün Turu"
                  onClick={() => toast.info("Ürün turu başlatılıyor...")}
                />
                <DropdownItem
                  icon={<Users className="w-4 h-4" />}
                  label="Recruiter Topluluğu"
                  onClick={() => toast.info("Topluluk yakında")}
                />
                <DropdownItem
                  icon={<Briefcase className="w-4 h-4" />}
                  label="İşe Alım Şablonları"
                  onClick={() => toast.info("Şablonlar yakında")}
                />
              </div>
            )}
          </div>

          {/* Messages quick */}
          <button
            onClick={() => navigate("/company/messages")}
            className="relative p-2.5 rounded-xl text-ink-700 hover:bg-ink-100"
            aria-label="Mesajlar"
          >
            <Inbox className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-royal-500 text-white text-[10px] font-bold inline-flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div ref={refNotif} className="relative">
            <button
              onClick={() => setOpenNotif((v) => !v)}
              className="relative p-2.5 rounded-xl text-ink-700 hover:bg-ink-100"
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            {openNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-deep border border-ink-100 overflow-hidden z-50">
                <div className="p-4 border-b border-ink-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-midnight-950">Aktivite</div>
                    <div className="text-xs text-ink-500">Son 24 saat</div>
                  </div>
                  <Link
                    to="/company/analytics"
                    onClick={() => setOpenNotif(false)}
                    className="text-xs font-semibold text-royal-700 hover:text-royal-800"
                  >
                    Tüm aktivite →
                  </Link>
                </div>
                <ul className="max-h-96 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3.5 border-b last:border-b-0 border-ink-50 hover:bg-ink-50/60"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0",
                          n.type === "interview" && "bg-royal-500",
                          n.type === "match" && "bg-electric-500",
                          n.type === "offer" && "bg-emerald-500",
                          n.type === "report" && "bg-amber-500"
                        )}
                      >
                        {n.type === "interview" && <CalendarRange className="w-4 h-4" />}
                        {n.type === "match" && <Sparkles className="w-4 h-4" />}
                        {n.type === "offer" && <Briefcase className="w-4 h-4" />}
                        {n.type === "report" && <Bell className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-midnight-950">{n.t}</div>
                        <div className="text-[10px] text-ink-400 mt-1">{n.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={refProfile} className="relative">
            <button
              onClick={() => setOpenProfile((v) => !v)}
              className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-ink-100"
            >
              <Avatar name={user?.fullName || "U"} color={user?.avatarColor || "#7c3aed"} size="sm" />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-midnight-950 truncate max-w-[120px]">
                  {user?.fullName || "Recruiter"}
                </div>
                <div className="text-[10px] text-royal-700 font-bold uppercase tracking-wider">
                  Recruiter
                </div>
              </div>
            </button>
            {openProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-deep border border-ink-100 overflow-hidden z-50">
                <div className="p-4 border-b border-ink-100">
                  <div className="text-sm font-bold text-midnight-950">{user?.fullName}</div>
                  <div className="text-xs text-ink-500 truncate">{user?.email}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-royal-700 bg-royal-50 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3" /> Growth Plan
                  </div>
                </div>
                <div className="p-2">
                  <DropdownItem
                    icon={<Building2 className="w-4 h-4" />}
                    label="Şirket Sayfası"
                    onClick={() => {
                      navigate("/company/brand");
                      setOpenProfile(false);
                    }}
                  />
                  <DropdownItem
                    icon={<UsersRoundIconWrapper />}
                    label="Ekip Yönetimi"
                    onClick={() => {
                      navigate("/company/team");
                      setOpenProfile(false);
                    }}
                  />
                  <DropdownItem
                    icon={<CreditCard className="w-4 h-4" />}
                    label="Faturalandırma"
                    onClick={() => {
                      navigate("/company/billing");
                      setOpenProfile(false);
                    }}
                  />
                </div>
                <div className="border-t border-ink-100 p-2">
                  <DropdownItem
                    icon={<Bell className="w-4 h-4" />}
                    label="Çıkış Yap"
                    danger
                    onClick={() => {
                      logout();
                      toast.success("Çıkış yapıldı");
                      navigate("/");
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function UsersRoundIconWrapper() {
  return <Users className="w-4 h-4" />;
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
        danger ? "text-rose-600 hover:bg-rose-50" : "text-ink-700 hover:bg-ink-100"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
