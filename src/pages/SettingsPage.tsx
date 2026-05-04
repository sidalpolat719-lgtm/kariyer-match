import { useState } from "react";
import {
  Bell,
  Eye,
  Globe,
  Lock,
  LogOut,
  Mail,
  Shield,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { Card, SectionTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/ui/Modal";
import { cn } from "../lib/cn";

const tabs = [
  { id: "account", label: "Hesap", icon: <User className="w-4 h-4" /> },
  { id: "notifications", label: "Bildirimler", icon: <Bell className="w-4 h-4" /> },
  { id: "privacy", label: "Gizlilik", icon: <Shield className="w-4 h-4" /> },
  { id: "preferences", label: "Tercihler", icon: <Sparkles className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [active, setActive] = useState("account");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [matchingNotif, setMatchingNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [profileVisible, setProfileVisible] = useState(true);
  const [searchable, setSearchable] = useState(true);

  const [language, setLanguage] = useState("tr");
  const [theme, setTheme] = useState("light");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-display text-2xl sm:text-3xl">Ayarlar</h1>
        <p className="text-ink-600 mt-1 text-sm">
          Hesabını ve PathMatch deneyimini buradan kişiselleştir.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <Card padded={false}>
            <ul className="p-2">
              {tabs.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setActive(t.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                      active === t.id
                        ? "bg-electric-50 text-electric-700"
                        : "text-ink-700 hover:bg-ink-100"
                    )}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        <div className="lg:col-span-9 space-y-6">
          {active === "account" && (
            <>
              <Card>
                <SectionTitle title="Hesap Bilgileri" description="Profilinde gösterilecek temel bilgiler" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Ad Soyad</label>
                    <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">E-posta</label>
                    <input
                      className="input mt-1.5"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {
                      updateUser({ fullName: name, email });
                      toast.success("Hesap bilgileri güncellendi");
                    }}
                  >
                    Kaydet
                  </Button>
                </div>
              </Card>

              <Card>
                <SectionTitle title="Şifre" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Mevcut Şifre</label>
                    <input className="input mt-1.5" type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="label">Yeni Şifre</label>
                    <input className="input mt-1.5" type="password" placeholder="En az 8 karakter" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => toast.success("Şifre güncellendi")}
                    iconLeft={<Lock className="w-4 h-4" />}
                  >
                    Şifreyi Güncelle
                  </Button>
                </div>
              </Card>

              <Card className="border-rose-100">
                <SectionTitle title="Tehlikeli Bölge" description="Bu işlemler geri alınamaz." />
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    iconLeft={<LogOut className="w-4 h-4" />}
                    onClick={() => {
                      logout();
                      toast.success("Çıkış yapıldı");
                      navigate("/");
                    }}
                  >
                    Tüm cihazlardan çıkış
                  </Button>
                  <Button
                    variant="danger"
                    iconLeft={<Trash2 className="w-4 h-4" />}
                    onClick={() => setConfirmOpen(true)}
                  >
                    Hesabı Sil
                  </Button>
                </div>
              </Card>
            </>
          )}

          {active === "notifications" && (
            <Card>
              <SectionTitle title="Bildirim Tercihleri" />
              <div className="divide-y divide-ink-100">
                <Toggle
                  icon={<Mail className="w-4 h-4" />}
                  title="E-posta bildirimleri"
                  description="Önemli güncellemeler için e-posta al."
                  value={emailNotif}
                  onChange={(v) => {
                    setEmailNotif(v);
                    toast.success("Tercih kaydedildi");
                  }}
                />
                <Toggle
                  icon={<Bell className="w-4 h-4" />}
                  title="Push bildirimleri"
                  description="Tarayıcı üzerinden anlık bildirimler."
                  value={pushNotif}
                  onChange={(v) => {
                    setPushNotif(v);
                    toast.success("Tercih kaydedildi");
                  }}
                />
                <Toggle
                  icon={<Sparkles className="w-4 h-4" />}
                  title="Yeni eşleşme bildirimleri"
                  description="Sana uygun yeni fırsatlar için bildirim al."
                  value={matchingNotif}
                  onChange={(v) => {
                    setMatchingNotif(v);
                    toast.success("Tercih kaydedildi");
                  }}
                />
                <Toggle
                  icon={<Globe className="w-4 h-4" />}
                  title="Haftalık özet"
                  description="Her Pazartesi haftalık kariyer özeti."
                  value={weeklyDigest}
                  onChange={(v) => {
                    setWeeklyDigest(v);
                    toast.success("Tercih kaydedildi");
                  }}
                />
              </div>
            </Card>
          )}

          {active === "privacy" && (
            <Card>
              <SectionTitle title="Gizlilik" description="Profilini kimlerin görebileceğini belirle." />
              <div className="divide-y divide-ink-100">
                <Toggle
                  icon={<Eye className="w-4 h-4" />}
                  title="Profilim herkese açık"
                  description="Diğer üyeler profilini görüntüleyebilir."
                  value={profileVisible}
                  onChange={(v) => {
                    setProfileVisible(v);
                    toast.success("Gizlilik ayarı güncellendi");
                  }}
                />
                <Toggle
                  icon={<Globe className="w-4 h-4" />}
                  title="Aramalarda görün"
                  description="Şirketler seni keşfedebilir."
                  value={searchable}
                  onChange={(v) => {
                    setSearchable(v);
                    toast.success("Gizlilik ayarı güncellendi");
                  }}
                />
              </div>
            </Card>
          )}

          {active === "preferences" && (
            <Card>
              <SectionTitle title="Görünüm & Dil" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Dil</label>
                  <select className="input mt-1.5" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tema</label>
                  <select className="input mt-1.5" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light">Açık</option>
                    <option value="auto">Sistem</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => toast.success("Tercihler kaydedildi")}>Kaydet</Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Hesabı silmek istiyor musun?"
        description="Bu işlem geri alınamaz. Tüm verilerin kalıcı olarak silinecek."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Vazgeç
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmOpen(false);
                logout();
                window.localStorage.clear();
                toast.success("Hesabın silindi");
                navigate("/");
              }}
            >
              Hesabı Sil
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-700">
          Onaylamak için hesabını ve tüm ilişkili verileri silmek istediğini onayla.
        </p>
      </Modal>
    </div>
  );
}

function Toggle({
  icon,
  title,
  description,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-ink-50 text-electric-700 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-midnight-950 text-sm">{title}</div>
        <div className="text-xs text-ink-600">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors shrink-0",
          value ? "bg-electric-500" : "bg-ink-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform",
            value && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
