import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Building2,
  Globe,
  Lock,
  LogOut,
  Sparkles,
  Trash2,
  Workflow,
  Zap,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Tabs } from "../../components/ui/Tabs";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";

const tabs = [
  { id: "company", label: "Şirket", icon: <Building2 className="w-4 h-4" /> },
  { id: "automation", label: "Otomasyon", icon: <Workflow className="w-4 h-4" /> },
  { id: "notifications", label: "Bildirimler", icon: <Bell className="w-4 h-4" /> },
  { id: "security", label: "Güvenlik", icon: <Lock className="w-4 h-4" /> },
  { id: "integrations", label: "Entegrasyonlar", icon: <Zap className="w-4 h-4" /> },
];

export default function CompanySettingsPage() {
  const toast = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("company");
  const [confirmClose, setConfirmClose] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
          Şirket Ayarları
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          İşveren marka, otomasyon, bildirim ve güvenlik tercihleri.
        </p>
      </div>

      <Tabs
        tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
        active={tab}
        onChange={setTab}
      />

      {tab === "company" && <CompanyTab />}
      {tab === "automation" && <AutomationTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "security" && <SecurityTab />}
      {tab === "integrations" && <IntegrationsTab />}

      {/* Danger zone */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-rose-900">Tehlikeli Bölge</h3>
            <p className="text-sm text-rose-800 mt-1">
              Şirket hesabını kapatmak veya tüm verileri silmek geri alınamaz.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  toast.success("Çıkış yapıldı");
                  navigate("/");
                }}
                iconLeft={<LogOut className="w-4 h-4" />}
              >
                Çıkış Yap
              </Button>
              <Button
                variant="danger"
                onClick={() => setConfirmClose(true)}
                iconLeft={<Trash2 className="w-4 h-4" />}
              >
                Şirket Hesabını Kapat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        title="Şirket hesabını kapatmak istiyor musun?"
        description="Tüm ilanlar, aday kayıtları ve fatura geçmişi silinecek. Bu işlem geri alınamaz."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClose(false)}>
              Vazgeç
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                toast.success("Talep alındı, finans ekibi sizinle iletişime geçecek");
                setConfirmClose(false);
              }}
            >
              Evet, Kapat
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-700">
          Onayladığında 30 gün içinde tüm verilerin silinecek. Bu süre içinde geri dönmek için
          finans ekibimizle iletişime geçebilirsin.
        </p>
      </Modal>
    </div>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
      <h3 className="font-bold text-midnight-950">{title}</h3>
      {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function CompanyTab() {
  const toast = useToast();
  const [language, setLanguage] = useState("tr");
  const [timezone, setTimezone] = useState("Europe/Istanbul");
  const [currency, setCurrency] = useState("TRY");

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="Genel" description="Çalışma alanı tercihleri">
        <div className="space-y-3">
          <div>
            <label className="label">Çalışma Alanı Adı</label>
            <input className="input mt-1.5" defaultValue="Nova Labs" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Dil</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input mt-1.5"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
            <div>
              <label className="label">Zaman Dilimi</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="input mt-1.5"
              >
                <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                <option value="Europe/London">Londra (GMT+0)</option>
                <option value="America/New_York">New York (GMT-5)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Para Birimi</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input mt-1.5"
            >
              <option value="TRY">₺ Türk Lirası</option>
              <option value="USD">$ ABD Doları</option>
              <option value="EUR">€ Euro</option>
            </select>
          </div>
          <Button onClick={() => toast.success("Ayarlar kaydedildi")} className="!bg-grad-corp-cta">
            Kaydet
          </Button>
        </div>
      </Card>

      <Card title="Aday Görünümü" description="Şirket sayfanız adaylara nasıl görünsün?">
        <ToggleRow
          label="İşveren markası rozetini göster"
          desc="Adaylar şirket profilinde marka rozetini görür."
          defaultOn
        />
        <ToggleRow
          label="Çalışan referanslarını yayınla"
          desc="Kabul edilen çalışan yorumları aday sayfasında listelenir."
        />
        <ToggleRow
          label="Maaş aralığını göster"
          desc="Tüm ilanlarda maaş aralığı public görünür."
          defaultOn
        />
        <ToggleRow
          label="Anonim soru-cevap"
          desc="Adaylar şirket sayfasında anonim soru sorabilir."
        />
      </Card>
    </div>
  );
}

function AutomationTab() {
  const toast = useToast();
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="İşe Alım Otomasyonu" description="Tekrarlayan görevleri otomatikleştir">
        <ToggleRow
          label="AI ile başvuru ön elemesi"
          desc="Eşleşme skoru %60 altında olan adaylar otomatik elenir."
          defaultOn
        />
        <ToggleRow
          label="Otomatik mülakat hatırlatıcısı"
          desc="24 saat öncesinden adaya ve recruiter'a hatırlatma gönder."
          defaultOn
        />
        <ToggleRow
          label="Reddetme e-postası şablonu"
          desc="Reddedilen adaylara otomatik kibarca e-posta gönderilir."
          defaultOn
        />
        <ToggleRow
          label="Pipeline temizliği (90 gün)"
          desc="90 gün hareket görmeyen adaylar arşivlenir."
        />
      </Card>

      <Card title="Eşleşme Tercihleri" description="AI matching algoritması ayarları">
        <div className="space-y-4">
          <div>
            <label className="label">Minimum Eşleşme Skoru</label>
            <div className="mt-2">
              <input type="range" min="50" max="95" defaultValue="75" className="w-full accent-royal-500" />
              <div className="flex justify-between text-[10px] text-ink-500 mt-1">
                <span>50%</span>
                <span className="font-bold text-royal-700">75%</span>
                <span>95%</span>
              </div>
            </div>
          </div>
          <ToggleRow label="Yetenek eşleşmesini önceliklendir" defaultOn />
          <ToggleRow label="Kültürel uyumu hesapla" defaultOn />
          <ToggleRow label="Lokasyon yakınlığını hesapla" />
          <Button
            onClick={() => toast.success("Eşleşme algoritması güncellendi")}
            className="!bg-grad-corp-cta"
          >
            Algoritmayı Güncelle
          </Button>
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="E-posta Bildirimleri">
        <ToggleRow label="Yeni başvuru aldığında" defaultOn />
        <ToggleRow label="AI yüksek eşleşme bulduğunda (%90+)" defaultOn />
        <ToggleRow label="Mülakat geri bildirimi geldiğinde" defaultOn />
        <ToggleRow label="Aday teklifi kabul / reddettiğinde" defaultOn />
        <ToggleRow label="Haftalık rekruitment raporu" />
      </Card>
      <Card title="Push & Slack">
        <ToggleRow label="Slack: yeni öncelikli aday" />
        <ToggleRow label="Slack: pipeline değişikliği" />
        <ToggleRow label="Mobil push bildirim" defaultOn />
        <ToggleRow label="Şirket markasında yeni etkileşim" />
      </Card>
    </div>
  );
}

function SecurityTab() {
  const toast = useToast();
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="Şifre & Oturum">
        <div className="space-y-3">
          <div>
            <label className="label">Mevcut Şifre</label>
            <input type="password" className="input mt-1.5" placeholder="••••••••" />
          </div>
          <div>
            <label className="label">Yeni Şifre</label>
            <input type="password" className="input mt-1.5" placeholder="••••••••" />
          </div>
          <Button onClick={() => toast.success("Şifre güncellendi")} className="!bg-grad-corp-cta">
            Şifreyi Değiştir
          </Button>
        </div>
        <div className="mt-5 pt-5 border-t border-ink-100">
          <ToggleRow label="İki faktörlü doğrulama (2FA)" desc="Authenticator uygulaması ile" defaultOn />
          <ToggleRow label="Şüpheli giriş bildirimi" defaultOn />
        </div>
      </Card>
      <Card title="Kurumsal Güvenlik" description="Enterprise plan özellikleri">
        <div className="rounded-2xl bg-grad-corp-soft border border-royal-100 p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-royal-600 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-royal-900">SSO & SCIM</div>
              <p className="text-xs text-ink-600 mt-0.5">
                Enterprise planı ile Google Workspace, Microsoft Azure AD, Okta entegrasyonu.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info("Satış ekibi sizinle iletişime geçecek")}
                className="mt-3"
              >
                Enterprise'a Geç
              </Button>
            </div>
          </div>
        </div>
        <ToggleRow label="IP kısıtlama (özel ağ)" />
        <ToggleRow label="Veri ihracatı izinleri" defaultOn />
      </Card>
    </div>
  );
}

function IntegrationsTab() {
  const toast = useToast();
  const integrations = [
    { name: "Slack", desc: "Bildirimleri Slack kanalınıza gönderin", icon: "💬", connected: true },
    { name: "Google Calendar", desc: "Mülakatları otomatik takvime ekle", icon: "📅", connected: true },
    { name: "Microsoft Teams", desc: "Online mülakatları Teams üzerinden başlat", icon: "🎥", connected: false },
    { name: "Zoom", desc: "Mülakatlar için Zoom oda oluştur", icon: "📹", connected: false },
    { name: "LinkedIn Recruiter", desc: "LinkedIn'den aday import et", icon: "💼", connected: true },
    { name: "Workday ATS", desc: "Mevcut ATS'ye senkronize et", icon: "🔄", connected: false },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((it) => (
        <div
          key={it.name}
          className="bg-white rounded-2xl border border-ink-100 p-5 shadow-soft hover:border-royal-200 transition"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="w-12 h-12 rounded-xl bg-grad-corp-soft text-2xl flex items-center justify-center">
              {it.icon}
            </div>
            {it.connected && (
              <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Bağlı
              </span>
            )}
          </div>
          <div className="mt-3 font-bold text-midnight-950">{it.name}</div>
          <p className="text-xs text-ink-500 mt-1 mb-3">{it.desc}</p>
          <Button
            size="sm"
            fullWidth
            variant={it.connected ? "outline" : "primary"}
            onClick={() =>
              toast.success(
                it.connected ? `${it.name} bağlantısı kaldırıldı` : `${it.name} bağlandı`
              )
            }
            className={!it.connected ? "!bg-grad-corp-cta" : ""}
          >
            {it.connected ? "Bağlantıyı Kaldır" : "Bağla"}
          </Button>
        </div>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  defaultOn,
}: {
  label: string;
  desc?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0 border-b last:border-b-0 border-ink-100">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-midnight-950">{label}</div>
        {desc && <p className="text-xs text-ink-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5",
          on ? "bg-grad-corp-cta" : "bg-ink-200"
        )}
        aria-label="Toggle"
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
            on ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

void Globe;
