import { useState } from "react";
import {
  Check,
  CreditCard,
  Download,
  HelpCircle,
  Receipt,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";
import { cn } from "../../lib/cn";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "₺ 2.490",
    period: "/ ay",
    description: "Küçük ekipler ve ilk adımlar için.",
    features: ["3 aktif ilan", "AI temel eşleşme", "5 ekip üyesi", "E-posta destek"],
    cta: "Mevcut Plan",
    accent: "from-ink-400 to-ink-600",
  },
  {
    id: "growth",
    name: "Growth",
    price: "₺ 4.890",
    period: "/ ay",
    description: "Aktif olarak işe alım yapan ekipler için.",
    features: [
      "Sınırsız ilan",
      "Gelişmiş AI eşleşme + içgörü",
      "20 ekip üyesi",
      "Pipeline & analitik",
      "Öncelikli destek",
    ],
    cta: "Mevcut Plan",
    popular: true,
    accent: "from-royal-500 to-fuchsia-500",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Özel Fiyat",
    period: "",
    description: "Çok lokasyonlu, büyük ölçekli işe alım operasyonları.",
    features: [
      "Sınırsız her şey",
      "Özel hesap yöneticisi",
      "SLA & güvenlik raporları",
      "ATS entegrasyonu",
      "SSO / SCIM",
    ],
    cta: "Bize Ulaşın",
    accent: "from-midnight-700 to-royal-700",
  },
];

const usage = [
  { label: "Aktif İlan", used: 6, limit: 999, unit: "" },
  { label: "Ekip Üyesi", used: 6, limit: 20, unit: "" },
  { label: "AI Eşleşme (Aylık)", used: 482, limit: 1500, unit: "" },
  { label: "Veri Saklama", used: 18, limit: 50, unit: " GB" },
];

export default function CompanyBillingPage() {
  const { invoices } = useCompanyData();
  const toast = useToast();
  const [currentPlan, setCurrentPlan] = useState("growth");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
          Plan & Faturalandırma
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          Mevcut planını yönet, kullanımını takip et, geçmiş faturaları indir.
        </p>
      </div>

      {/* Current plan + usage */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div
          className="lg:col-span-2 rounded-3xl p-6 text-white relative overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(135deg, #0d1a3a 0%, #4c1d95 50%, #d946ef 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl"
            style={{ background: "#fae8ff" }}
          />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-200">
                  Mevcut Planın
                </div>
                <h2 className="mt-1 text-3xl font-extrabold">Growth Plan</h2>
                <p className="mt-1 text-white/80">Aylık ₺ 4.890 · Sonraki ödeme 1 Haziran 2026</p>
              </div>
              <Sparkles className="w-7 h-7 text-fuchsia-200" />
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {usage.map((u) => {
                const pct = Math.min(100, (u.used / u.limit) * 100);
                return (
                  <div key={u.label} className="rounded-xl bg-white/10 backdrop-blur p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/70">
                      {u.label}
                    </div>
                    <div className="text-lg font-extrabold mt-1">
                      {u.used.toLocaleString("tr-TR")}
                      {u.unit}
                      <span className="text-xs text-white/60 font-medium">
                        {" "}/ {u.limit === 999 ? "∞" : u.limit.toLocaleString("tr-TR") + u.unit}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                onClick={() => toast.info("Plan yükseltme paneli açıldı")}
                iconLeft={<Zap className="w-4 h-4" />}
                className="!bg-white !text-midnight-950 hover:!bg-white/90"
              >
                Plan Yükselt
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.success("Yıllık faturaya geçildi (örnek)")}
                className="!text-white !bg-white/10 hover:!bg-white/20 backdrop-blur"
              >
                Yıllık Plana Geç (%20 İndirim)
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
          <h3 className="font-bold text-midnight-950 mb-3 inline-flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-royal-700" /> Ödeme Yöntemi
          </h3>
          <div className="rounded-xl border border-ink-100 p-3 flex items-center gap-3">
            <div className="w-12 h-8 rounded bg-grad-corp text-white flex items-center justify-center font-bold text-xs">
              VISA
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-midnight-950">**** **** **** 4242</div>
              <div className="text-[11px] text-ink-500">Son kullanma 09/2027</div>
            </div>
            <button
              onClick={() => toast.info("Kart değiştirme yakında")}
              className="text-xs font-semibold text-royal-700 hover:text-royal-800"
            >
              Değiştir
            </button>
          </div>
          <Button
            fullWidth
            variant="outline"
            onClick={() => toast.info("Yedek kart eklendi")}
            className="mt-3"
          >
            Yedek Kart Ekle
          </Button>

          <h3 className="font-bold text-midnight-950 mt-6 mb-3 inline-flex items-center gap-2">
            <Receipt className="w-4 h-4 text-royal-700" /> Fatura Bilgileri
          </h3>
          <div className="rounded-xl border border-ink-100 p-3 text-sm">
            <div className="font-bold text-midnight-950">Nova Labs Tek. A.Ş.</div>
            <div className="text-xs text-ink-500 mt-0.5">
              Maslak Mh., İstanbul · VKN 1234567890
            </div>
          </div>
          <button
            onClick={() => toast.success("Fatura bilgileri güncellendi")}
            className="mt-2 text-xs font-semibold text-royal-700 hover:text-royal-800"
          >
            Bilgileri Düzenle
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <h2 className="font-bold text-midnight-950 text-lg">Plan Karşılaştırma</h2>
            <p className="text-xs text-ink-500">Tüm planlar ihtiyacın oldukça yükseltilebilir.</p>
          </div>
          <div className="inline-flex p-1 rounded-xl bg-ink-100">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-lg",
                billingCycle === "monthly" ? "bg-white shadow text-midnight-950" : "text-ink-600"
              )}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-lg inline-flex items-center gap-1",
                billingCycle === "yearly" ? "bg-white shadow text-midnight-950" : "text-ink-600"
              )}
            >
              Yıllık
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border p-5 transition",
                  isCurrent
                    ? "border-royal-300 ring-2 ring-royal-200 bg-grad-corp-soft"
                    : "border-ink-100 bg-white hover:border-royal-200"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full bg-grad-corp-cta">
                    En Popüler
                  </div>
                )}
                <div className="text-sm font-bold text-midnight-950">{plan.name}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-midnight-950">{plan.price}</span>
                  {plan.period && (
                    <span className="text-xs text-ink-500 font-medium">{plan.period}</span>
                  )}
                </div>
                <p className="text-xs text-ink-500 mt-2">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                      <Check className="w-4 h-4 text-royal-600 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  fullWidth
                  className={cn("mt-5", isCurrent ? "" : "!bg-grad-corp-cta")}
                  variant={isCurrent ? "outline" : "primary"}
                  onClick={() => {
                    if (plan.id === "enterprise") {
                      toast.info("Satış ekibi sizinle iletişime geçecek");
                    } else if (!isCurrent) {
                      setConfirm(plan.id);
                    }
                  }}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Mevcut Plan" : plan.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-soft overflow-hidden">
        <div className="p-6 pb-3 flex items-end justify-between">
          <div>
            <h2 className="font-bold text-midnight-950 text-lg">Fatura Geçmişi</h2>
            <p className="text-xs text-ink-500">Geçmiş ödemelerini görüntüle ve indir.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <TrendingUp className="w-3 h-3" /> %12 daha az harcadın
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-ink-500 bg-ink-50/50">
            <tr>
              <th className="text-left px-6 py-2.5 font-bold">Fatura No</th>
              <th className="text-left px-2 py-2.5 font-bold">Plan</th>
              <th className="text-left px-2 py-2.5 font-bold">Tarih</th>
              <th className="text-right px-2 py-2.5 font-bold">Tutar</th>
              <th className="text-left px-2 py-2.5 font-bold">Durum</th>
              <th className="px-6"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-ink-100 hover:bg-royal-50/20 transition">
                <td className="px-6 py-3 font-bold text-midnight-950">{inv.number}</td>
                <td className="px-2 py-3 text-ink-700">{inv.plan}</td>
                <td className="px-2 py-3 text-ink-700">{inv.date}</td>
                <td className="px-2 py-3 text-right font-bold text-midnight-950">{inv.amount}</td>
                <td className="px-2 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md",
                      inv.status === "paid" && "bg-emerald-50 text-emerald-700",
                      inv.status === "pending" && "bg-amber-50 text-amber-700",
                      inv.status === "failed" && "bg-rose-50 text-rose-700"
                    )}
                  >
                    {inv.status === "paid" ? "Ödendi" : inv.status === "pending" ? "Bekliyor" : "Başarısız"}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => toast.success(`${inv.number} indirildi`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-royal-700 hover:text-royal-800"
                  >
                    <Download className="w-3.5 h-3.5" /> İndir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help */}
      <div className="rounded-2xl border border-royal-100 bg-grad-corp-soft p-5 flex flex-wrap items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-grad-corp-cta text-white flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-midnight-950">Faturalandırma sorunu mu yaşıyorsun?</div>
          <p className="text-xs text-ink-600">Finans ekibimiz 24 saat içinde cevap verir.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast.info("Destek talebi açıldı")}
        >
          Destek Talebi Aç
        </Button>
      </div>

      {/* Confirm plan change */}
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Planı Değiştir"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                if (confirm) {
                  setCurrentPlan(confirm);
                  toast.success(`${plans.find((p) => p.id === confirm)?.name} planına geçildi`);
                  setConfirm(null);
                }
              }}
              className="!bg-grad-corp-cta"
            >
              Onayla
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-700">
          {plans.find((p) => p.id === confirm)?.name} planına geçmek istediğine emin misin? Yeni
          fatura döneminde geçerli olacak.
        </p>
      </Modal>
    </div>
  );
}
