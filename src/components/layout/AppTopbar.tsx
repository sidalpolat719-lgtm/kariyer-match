import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Search, Settings, LogOut, User as UserIcon } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { cn } from "../../lib/cn";

interface Props {
  onMenu: () => void;
}

export function AppTopbar({ onMenu }: Props) {
  const { notifications, markAllNotificationsRead, markNotificationRead, internships } = useAppData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setOpenNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setOpenProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpenSearch(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const searchResults = search
    ? internships
        .filter(
          (i) =>
            i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.company.toLowerCase().includes(search.toLowerCase()) ||
            i.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-ink-100">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-ink-100"
          onClick={onMenu}
          aria-label="Menü"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div ref={searchRef} className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenSearch(true);
            }}
            onFocus={() => setOpenSearch(true)}
            placeholder="Pozisyon, şirket veya yetenek ara…"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-ink-50/80 border border-transparent rounded-xl outline-none focus:bg-white focus:border-electric-300 focus:ring-4 focus:ring-electric-100"
          />
          {openSearch && search && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ink-100 rounded-2xl shadow-deep overflow-hidden z-50">
              <div className="p-2 max-h-80 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-sm text-ink-500">Sonuç bulunamadı.</div>
                ) : (
                  searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        navigate(`/internships/${r.id}`);
                        setOpenSearch(false);
                        setSearch("");
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-ink-50"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: r.logoColor }}
                      >
                        {r.companyShort}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-midnight-950 truncate">{r.title}</div>
                        <div className="text-xs text-ink-500 truncate">
                          {r.company} · {r.location}
                        </div>
                      </div>
                      <span className="ml-auto text-xs font-bold text-electric-700">%{r.matchScore}</span>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-ink-100 p-2 bg-ink-50/50 flex items-center justify-between">
                <span className="text-[11px] text-ink-500">
                  Enter ile ara · Esc kapat
                </span>
                <button
                  onClick={() => {
                    navigate(`/app/internships?q=${encodeURIComponent(search)}`);
                    setOpenSearch(false);
                  }}
                  className="text-xs font-semibold text-electric-700 hover:text-electric-800"
                >
                  Tümünü gör →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setOpenNotif((v) => !v)}
              className="relative p-2.5 rounded-xl text-ink-700 hover:bg-ink-100"
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
            {openNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-deep border border-ink-100 overflow-hidden z-50">
                <div className="p-4 flex items-center justify-between border-b border-ink-100">
                  <div>
                    <div className="font-bold text-midnight-950">Bildirimler</div>
                    <div className="text-xs text-ink-500">{unread} okunmamış bildirim</div>
                  </div>
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                      toast.success("Tümü okundu olarak işaretlendi");
                    }}
                    className="text-xs font-semibold text-electric-700 hover:text-electric-800"
                  >
                    Tümünü okundu yap
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3.5 text-left border-b last:border-b-0 border-ink-50 hover:bg-ink-50/60",
                        !n.read && "bg-electric-50/30"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 w-2 h-2 rounded-full shrink-0",
                          n.read ? "bg-ink-300" : "bg-electric-500"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-midnight-950">{n.title}</div>
                        <div className="text-xs text-ink-600 mt-0.5">{n.body}</div>
                        <div className="text-[10px] text-ink-400 mt-1">{n.time}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setOpenProfile((v) => !v)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-ink-100"
            >
              <Avatar name={user?.fullName || "U"} color={user?.avatarColor} size="sm" />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-midnight-950 truncate max-w-[140px]">
                  {user?.fullName}
                </div>
                <div className="text-[11px] text-ink-500 truncate">
                  {user?.role === "company" ? "Şirket" : user?.role === "mentor" ? "Mentor" : "Öğrenci"}
                </div>
              </div>
            </button>
            {openProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-deep border border-ink-100 overflow-hidden z-50">
                <div className="p-4 border-b border-ink-100">
                  <div className="text-sm font-bold text-midnight-950">{user?.fullName}</div>
                  <div className="text-xs text-ink-500">{user?.email}</div>
                </div>
                <div className="p-2">
                  <DropdownItem
                    icon={<UserIcon className="w-4 h-4" />}
                    label="Profilim"
                    onClick={() => {
                      navigate("/app/profile");
                      setOpenProfile(false);
                    }}
                  />
                  <DropdownItem
                    icon={<Settings className="w-4 h-4" />}
                    label="Ayarlar"
                    onClick={() => {
                      navigate("/app/settings");
                      setOpenProfile(false);
                    }}
                  />
                </div>
                <div className="border-t border-ink-100 p-2">
                  <DropdownItem
                    icon={<LogOut className="w-4 h-4" />}
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
