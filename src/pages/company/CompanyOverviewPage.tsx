import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarRange,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { stageLabels } from "../../data/companySeed";
import { NewPostingModal } from "../../components/company/NewPostingModal";
import { cn } from "../../lib/cn";

export default function CompanyOverviewPage() {
  const { user } = useAuth();
  const { postings, talent, interviews, analytics, profile, setCandidateStage } = useCompanyData();
  const navigate = useNavigate();
  const toast = useToast();
  const [openNew, setOpenNew] = useState(false);

  const activePostings = postings.filter((p) => p.status === "active").length;
  const totalApplicants = postings.reduce((s, p) => s + p.applicants, 0);
  const upcomingInterviews = interviews.filter((i) => i.status === "scheduled").slice(0, 4);
  const newCandidates = talent.filter((c) => c.stage === "new").length;
  const offersOut = talent.filter((c) => c.stage === "offer").length;
  const hiresThisMonth = talent.filter((c) => c.stage === "hired").length;

  const topMatches = [...talent].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);

  const recentActivity = [
    { who: "Ada Yılmaz", what: "mülakat davetini onayladı", when: "2 dk önce", color: "#7c3aed", type: "interview" },
    { who: "Ece Demir", what: "iş teklifini inceliyor", when: "10 dk önce", color: "#ef4444", type: "offer" },
    { who: "Frontend Stajyer", what: "ilanına 4 yeni başvuru", when: "32 dk önce", color: "#06b6d4", type: "application" },
    { who: "Naz Aydın", what: "final görüşme için referans paylaştı", when: "1 sa önce", color: "#8b5cf6", type: "interview" },
    { who: "Selin Kaya", what: "yeni aday olarak eklendi", when: "2 sa önce", color: "#ec4899", type: "match" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl text-white p-6 sm:p-8"
        style={{
          backgroundImage: "linear-gradient(135deg, #0d1a3a 0%, #4c1d95 60%, #7c3aed 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(at 0% 0%, #d946ef 0px, transparent 50%), radial-gradient(at 100% 100%, #06b6d4 0px, transparent 50%)",
          }}
        />
        <div className="relative grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
              Recruiter Workspace · Nova Labs
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold">
              Hoş geldin, {user?.fullName?.split(" ")[0] || "Recruiter"} 👋
            </h1>
            <p className="mt-2 text-white/80 max-w-xl">
              Bugün <strong className="text-white">{newCandidates} yeni aday</strong> ve{" "}
              <strong className="text-white">{upcomingInterviews.length} mülakat</strong> seni bekliyor.
              Funnel'ında 24 saatte %18 büyüme var.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setOpenNew(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-midnight-950 bg-white hover:bg-white/90 transition"
              >
                <Plus className="w-4 h-4" /> Yeni İlan Oluştur
              </button>
              <button
                onClick={() => navigate("/company/talent")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 text-sm font-semibold"
              >
                <Users className="w-4 h-4" /> Aday Havuzu
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <KpiTile label="Aktif İlan" value={String(activePostings)} delta="+2" />
              <KpiTile label="Toplam Aday" value={String(totalApplicants)} delta="+18%" />
              <KpiTile label="Açık Teklif" value={String(offersOut)} delta="+1" />
              <KpiTile label="Bu Ay İşe Alım" value={String(hiresThisMonth)} delta="+25%" />
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* LEFT: Funnel + activity */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recruitment Funnel */}
          <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-midnight-950">İşe Alım Funnel'ı</h2>
                <p className="text-sm text-ink-500 mt-0.5">Son 30 gün</p>
              </div>
              <button
                onClick={() => navigate("/company/analytics")}
                className="text-sm font-semibold text-royal-700 hover:text-royal-800 inline-flex items-center gap-1"
              >
                Detaylı analiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <FunnelChart data={analytics.funnel} />

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-ink-100">
              <ConversionPill from="Görüntülenme" to="Başvuru" rate="6,4%" />
              <ConversionPill from="Başvuru" to="Eşleşme" rate="45,8%" />
              <ConversionPill from="Mülakat" to="Teklif" rate="28,1%" />
              <ConversionPill from="Teklif" to="Kabul" rate="66,7%" highlight />
            </div>
          </div>

          {/* Top matches */}
          <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-midnight-950">AI Eşleşmiş En İyi Adaylar</h2>
                <p className="text-sm text-ink-500 mt-0.5">
                  Profillere göre %85+ uyumlu öneriler
                </p>
              </div>
              <button
                onClick={() => navigate("/company/talent")}
                className="text-sm font-semibold text-royal-700 hover:text-royal-800 inline-flex items-center gap-1"
              >
                Tüm havuz <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <ul className="divide-y divide-ink-100">
              {topMatches.map((c) => (
                <li key={c.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <Avatar name={c.name} color={c.avatarColor} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-midnight-950 truncate">{c.name}</span>
                      {c.starred && (
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <div className="text-xs text-ink-500 truncate">{c.headline}</div>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5">
                    {c.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-royal-50 text-royal-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <MatchPill score={c.matchScore} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCandidateStage(c.id, "interview");
                        toast.success(`${c.name.split(" ")[0]} için mülakat aşamasına alındı`);
                      }}
                    >
                      Mülakata Al
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Active postings table */}
          <div className="bg-white rounded-3xl border border-ink-100 shadow-soft overflow-hidden">
            <div className="p-6 pb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold text-midnight-950">Aktif İlanlarım</h2>
                <p className="text-sm text-ink-500 mt-0.5">Performans ve aday hareketi</p>
              </div>
              <button
                onClick={() => navigate("/company/postings")}
                className="text-sm font-semibold text-royal-700 hover:text-royal-800 inline-flex items-center gap-1"
              >
                Tümünü yönet <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-ink-500 bg-ink-50/50">
                  <tr>
                    <th className="text-left px-6 py-2.5 font-bold">Pozisyon</th>
                    <th className="text-right px-3 py-2.5 font-bold">Görüntülenme</th>
                    <th className="text-right px-3 py-2.5 font-bold">Başvuru</th>
                    <th className="text-right px-3 py-2.5 font-bold">Mülakat</th>
                    <th className="text-right px-6 py-2.5 font-bold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {postings
                    .filter((p) => p.status === "active")
                    .map((p) => (
                      <tr key={p.id} className="border-t border-ink-100 hover:bg-ink-50/40 transition">
                        <td className="px-6 py-3">
                          <div className="font-bold text-midnight-950">{p.title}</div>
                          <div className="text-[11px] text-ink-500 mt-0.5">
                            {p.department} · {p.location}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right text-ink-700">{p.views.toLocaleString("tr-TR")}</td>
                        <td className="px-3 py-3 text-right">
                          <span className="font-bold text-midnight-950">{p.applicants}</span>
                          <span className="text-ink-400 text-xs"> ({p.matches} eşleşti)</span>
                        </td>
                        <td className="px-3 py-3 text-right text-ink-700">{p.interviewed}</td>
                        <td className="px-6 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <ArrowUpRight className="w-3 h-3" /> +{Math.floor(Math.random() * 30 + 5)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Side */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today schedule */}
          <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-soft">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3 className="font-bold text-midnight-950">Bugün</h3>
                <p className="text-xs text-ink-500">{upcomingInterviews.length} mülakat planlı</p>
              </div>
              <button
                onClick={() => navigate("/company/interviews")}
                className="text-xs font-semibold text-royal-700 hover:text-royal-800"
              >
                Takvim →
              </button>
            </div>
            <ul className="space-y-3">
              {upcomingInterviews.map((iv) => (
                <li
                  key={iv.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-ink-100 hover:border-royal-200 hover:bg-royal-50/30 transition"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${iv.candidateColor} 0%, ${iv.candidateColor}cc 100%)`,
                    }}
                  >
                    <CalendarRange className="w-4 h-4" />
                    <span className="text-[10px] font-bold mt-0.5">{iv.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-midnight-950 truncate">
                      {iv.candidateName}
                    </div>
                    <div className="text-xs text-ink-500 truncate">{iv.postingTitle}</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-royal-700 bg-royal-50 px-1.5 py-0.5 rounded">
                      {iv.type} · {iv.mode}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pipeline snapshot */}
          <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-soft">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3 className="font-bold text-midnight-950">Pipeline Anlık</h3>
                <p className="text-xs text-ink-500">Aday aşamaları</p>
              </div>
              <button
                onClick={() => navigate("/company/pipeline")}
                className="text-xs font-semibold text-royal-700 hover:text-royal-800"
              >
                Pipeline →
              </button>
            </div>
            <div className="space-y-2.5">
              {(["new", "screening", "interview", "offer", "hired"] as const).map((stage) => {
                const count = talent.filter((c) => c.stage === stage).length;
                const max = talent.length;
                const pct = (count / max) * 100;
                const color = {
                  new: "#94a2bd",
                  screening: "#06b6d4",
                  interview: "#f59e0b",
                  offer: "#7c3aed",
                  hired: "#10b981",
                }[stage];
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-ink-700">{stageLabels[stage]}</span>
                      <span className="font-bold text-midnight-950">{count}</span>
                    </div>
                    <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-soft">
            <h3 className="font-bold text-midnight-950 mb-4">Son Aktivite</h3>
            <ul className="space-y-3 -mx-1">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-3 px-1">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      a.type === "interview" && "bg-royal-500",
                      a.type === "offer" && "bg-emerald-500",
                      a.type === "application" && "bg-electric-500",
                      a.type === "match" && "bg-amber-500"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-midnight-950">
                      <span className="font-bold">{a.who}</span>{" "}
                      <span className="text-ink-600">{a.what}</span>
                    </div>
                    <div className="text-[10px] text-ink-400 mt-0.5">{a.when}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand health */}
          <div
            className="rounded-3xl p-5 text-white relative overflow-hidden"
            style={{
              backgroundImage: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #d946ef 100%)",
            }}
          >
            <div
              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-3xl"
              style={{ background: "#fae8ff" }}
            />
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-200">
                İşveren Markası
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span className="text-2xl font-extrabold">{profile.rating}</span>
                <span className="text-sm text-white/70">/ 5</span>
              </div>
              <p className="text-xs text-white/80 mt-1">
                {profile.followers.toLocaleString("tr-TR")} takipçi · {profile.hires} işe alım
              </p>
              <button
                onClick={() => navigate("/company/brand")}
                className="mt-4 w-full text-xs font-bold py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur transition"
              >
                Şirket Sayfanı Yönet
              </button>
            </div>
          </div>
        </div>
      </div>

      <NewPostingModal open={openNew} onClose={() => setOpenNew(false)} />
    </div>
  );
}

function KpiTile({ label, value, delta }: { label: string; value: string; delta?: string }) {
  const positive = delta?.startsWith("+");
  return (
    <div className="rounded-2xl p-4 bg-white/10 backdrop-blur border border-white/20">
      <div className="text-[11px] uppercase tracking-wider text-white/70">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
      {delta && (
        <div
          className={cn(
            "inline-flex items-center gap-0.5 text-[10px] font-bold mt-1",
            positive ? "text-emerald-300" : "text-rose-300"
          )}
        >
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {delta}
        </div>
      )}
    </div>
  );
}

function FunnelChart({ data }: { data: { stage: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.stage} className="flex items-center gap-3">
            <div className="w-32 sm:w-40 text-xs font-semibold text-ink-700 shrink-0">{d.stage}</div>
            <div className="flex-1 relative h-9 bg-ink-50 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center pl-3"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${d.color} 0%, ${d.color}aa 100%)`,
                }}
              >
                <span className="text-xs font-bold text-white">
                  {d.value.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>
            <div className="w-12 text-right text-xs font-bold text-midnight-950 shrink-0">
              %{Math.round(pct)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConversionPill({
  from,
  to,
  rate,
  highlight,
}: {
  from: string;
  to: string;
  rate: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-3 border",
        highlight ? "bg-emerald-50 border-emerald-100" : "bg-ink-50/50 border-ink-100"
      )}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
        {from} → {to}
      </div>
      <div
        className={cn(
          "text-lg font-extrabold mt-1",
          highlight ? "text-emerald-700" : "text-midnight-950"
        )}
      >
        {rate}
      </div>
    </div>
  );
}

function MatchPill({ score }: { score: number }) {
  const tone =
    score >= 90
      ? "bg-emerald-50 text-emerald-700"
      : score >= 80
      ? "bg-royal-50 text-royal-700"
      : "bg-electric-50 text-electric-700";
  return <span className={cn("text-xs font-bold px-2 py-1 rounded-md", tone)}>%{score}</span>;
}

void TrendingUp;
void CheckCircle2;
void Eye;
void Briefcase;
void UserCheck;
void Clock;
