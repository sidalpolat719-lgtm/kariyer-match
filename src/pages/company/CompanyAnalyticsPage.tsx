import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Download, Sparkles } from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Tabs } from "../../components/ui/Tabs";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { cn } from "../../lib/cn";

export default function CompanyAnalyticsPage() {
  const { analytics, postings, talent } = useCompanyData();
  const toast = useToast();
  const [range, setRange] = useState("30d");

  const totals = {
    views: postings.reduce((s, p) => s + p.views, 0),
    applicants: postings.reduce((s, p) => s + p.applicants, 0),
    matches: postings.reduce((s, p) => s + p.matches, 0),
    interviews: postings.reduce((s, p) => s + p.interviewed, 0),
    hires: postings.reduce((s, p) => s + p.hires, 0),
  };

  const offerAcceptance = 67;
  const avgTimeToHire = 18;
  const sourceTotal = analytics.sources.reduce((s, x) => s + x.value, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
            Talent Analitiği
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            İşe alım performansı, kanal verimi ve trendler
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            tabs={[
              { id: "7d", label: "7 Gün" },
              { id: "30d", label: "30 Gün" },
              { id: "90d", label: "90 Gün" },
              { id: "12m", label: "12 Ay" },
            ]}
            active={range}
            onChange={setRange}
            size="sm"
          />
          <Button
            variant="outline"
            iconLeft={<Download className="w-4 h-4" />}
            onClick={() => toast.success("Rapor PDF olarak indirildi")}
          >
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard label="Görüntülenme" value={totals.views.toLocaleString("tr-TR")} delta="+18%" />
        <KpiCard label="Başvuru" value={totals.applicants.toString()} delta="+24%" />
        <KpiCard label="AI Eşleşme" value={totals.matches.toString()} delta="+32%" highlight />
        <KpiCard label="Mülakat" value={totals.interviews.toString()} delta="+12%" />
        <KpiCard label="İşe Alım" value={String(talent.filter((t) => t.stage === "hired").length)} delta="+25%" highlight />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Funnel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-midnight-950">Conversion Funnel</h2>
              <p className="text-xs text-ink-500">Aşamalar arası dönüşüm oranları</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-royal-700 bg-royal-50 px-2 py-1 rounded-md">
              Son {range === "7d" ? "7" : range === "30d" ? "30" : range === "90d" ? "90" : "365"} gün
            </span>
          </div>
          <div className="space-y-3">
            {analytics.funnel.map((d, i) => {
              const max = analytics.funnel[0].value;
              const pct = (d.value / max) * 100;
              const conv =
                i > 0
                  ? Math.round((d.value / analytics.funnel[i - 1].value) * 100)
                  : 100;
              return (
                <div key={d.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-ink-700">{d.stage}</span>
                    <div className="flex items-center gap-3">
                      {i > 0 && (
                        <span className="text-ink-500">→ {conv}% dönüşüm</span>
                      )}
                      <span className="font-bold text-midnight-950">
                        {d.value.toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  <div className="h-9 bg-ink-50 rounded-lg overflow-hidden flex items-center">
                    <div
                      className="h-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${d.color} 0%, ${d.color}aa 100%)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sources donut */}
        <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
          <h2 className="font-bold text-midnight-950 mb-1">Aday Kaynakları</h2>
          <p className="text-xs text-ink-500 mb-5">Trafik kanal dağılımı</p>
          <div className="flex items-center justify-center mb-4">
            <Donut data={analytics.sources} total={sourceTotal} />
          </div>
          <ul className="space-y-2">
            {analytics.sources.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ background: s.color }}
                />
                <span className="text-ink-700 flex-1 truncate">{s.name}</span>
                <span className="font-bold text-midnight-950">%{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Hires over time bar chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-midnight-950">Aylık İşe Alım Trendi</h2>
              <p className="text-xs text-ink-500">Son 6 ay</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> +60% YoY
            </span>
          </div>
          <BarChart data={analytics.hiresOverTime} />
        </div>

        {/* Top skills */}
        <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
          <h2 className="font-bold text-midnight-950 mb-1">Talep Edilen Yetenekler</h2>
          <p className="text-xs text-ink-500 mb-4">Aday havuzu vs ilan ihtiyacı</p>
          <ul className="space-y-3">
            {analytics.topSkills.map((s) => (
              <li key={s.skill}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-ink-700">{s.skill}</span>
                  <span className="font-bold text-royal-700">%{s.demand}</span>
                </div>
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.demand}%`,
                      background: "linear-gradient(90deg,#8b5cf6,#d946ef)",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
          <h2 className="font-bold text-midnight-950 mb-5">Departman Bazlı Başvurular</h2>
          <BarChart data={analytics.applicantsByDepartment} color="#06b6d4" />
        </div>

        <div className="space-y-4">
          <BigStat
            label="Teklif Kabul Oranı"
            value={`%${offerAcceptance}`}
            delta="+12 puan"
            tone="emerald"
          />
          <BigStat
            label="Ortalama İşe Alım Süresi"
            value={`${avgTimeToHire} gün`}
            delta="-3 gün"
            tone="purple"
          />
          <div
            className="rounded-3xl p-5 text-white relative overflow-hidden"
            style={{ backgroundImage: "linear-gradient(135deg, #4c1d95, #d946ef)" }}
          >
            <Sparkles className="w-5 h-5 mb-2 text-fuchsia-200" />
            <div className="text-sm font-bold">AI Önerisi</div>
            <p className="text-xs text-white/80 mt-2">
              Mühendislik departmanı için aday havuzun talebin %38 altında. Kaynak çeşitliliğini
              artırmak için "Hibrit + Junior" filtreleriyle 12 aktif aday bulduk.
            </p>
            <button
              onClick={() => toast.success("Öneri pipeline'a eklendi")}
              className="mt-3 w-full text-xs font-bold py-2 rounded-lg bg-white text-midnight-950 hover:bg-white/90"
            >
              Adayları Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  highlight,
}: {
  label: string;
  value: string;
  delta?: string;
  highlight?: boolean;
}) {
  const positive = delta?.startsWith("+");
  return (
    <div
      className={cn(
        "rounded-2xl p-4 border shadow-soft",
        highlight ? "bg-grad-corp-soft border-royal-100" : "bg-white border-ink-100"
      )}
    >
      <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      <div className="text-2xl font-extrabold text-midnight-950 mt-1">{value}</div>
      {delta && (
        <div
          className={cn(
            "inline-flex items-center gap-0.5 text-[10px] font-bold mt-1",
            positive ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {delta}
        </div>
      )}
    </div>
  );
}

function BarChart({ data, color = "#7c3aed" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((d) => {
        const h = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-lg relative group"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, ${color}, ${color}66)`,
                }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-midnight-950 opacity-0 group-hover:opacity-100 transition">
                  {d.value}
                </div>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-ink-500">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function Donut({
  data,
  total,
}: {
  data: { name: string; value: number; color: string }[];
  total: number;
}) {
  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="relative w-44 h-44">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        {data.map((d) => {
          const dash = (d.value / total) * circumference;
          const seg = (
            <circle
              key={d.name}
              r={radius}
              cx={80}
              cy={80}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-extrabold text-midnight-950">{total}%</div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">Aday</div>
      </div>
    </div>
  );
}

function BigStat({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "emerald" | "purple";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 border",
        tone === "emerald" ? "bg-emerald-50 border-emerald-100" : "bg-royal-50 border-royal-100"
      )}
    >
      <div className="text-xs uppercase tracking-wider font-bold text-ink-600">{label}</div>
      <div className="text-3xl font-extrabold text-midnight-950 mt-2">{value}</div>
      <div
        className={cn(
          "text-xs font-bold mt-1",
          tone === "emerald" ? "text-emerald-700" : "text-royal-700"
        )}
      >
        {delta}
      </div>
    </div>
  );
}
