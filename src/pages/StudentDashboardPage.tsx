import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, SectionTitle } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { MatchScore } from "../components/ui/MatchScore";
import { Badge } from "../components/ui/Badge";
import { InternshipCard } from "../components/ui/InternshipCard";
import { Avatar } from "../components/ui/Avatar";
import { seedCompanies, seedMentors } from "../data/seed";
import { useToast } from "../context/ToastContext";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { internships, applications, profile, conversations } = useAppData();
  const navigate = useNavigate();
  const toast = useToast();

  const topMatches = [...internships].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  const upcomingInterviews = applications.filter((a) => a.status === "interview");
  const activeApps = applications.length;
  const interviewCount = upcomingInterviews.length;
  const newMatches = internships.filter((i) => i.matchScore >= 80).length;
  const overallScore = Math.round(
    internships.reduce((s, i) => s + i.matchScore, 0) / internships.length
  );

  const skillProgress = [
    { name: "React", level: 88 },
    { name: "TypeScript", level: 78 },
    { name: "UI/UX", level: 64 },
    { name: "Node.js", level: 55 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-grad-primary text-white p-6 sm:p-8">
        <div className="absolute inset-0 -z-0 bg-grad-mesh opacity-25 mix-blend-overlay" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-electric-400/20 blur-3xl" />
        <div className="relative grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-electric-200" />
              Bugün senin için 12 yeni eşleşme var
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hoş geldin, {user?.fullName?.split(" ")[0] || "Ada"} 👋
            </h1>
            <p className="mt-2 text-white/80 max-w-lg">
              Kariyer hedeflerine bir adım daha yakınsın. Aşağıdaki önerilerle güne başla ya da
              yeteneklerini güncelleyerek eşleşme skorunu artır.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => navigate("/app/matches")} variant="primary">
                Eşleşmelerimi Gör
              </Button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 text-sm font-semibold"
                onClick={() => navigate("/app/profile")}
              >
                Yeteneklerini Güncelle <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-5 bg-white/10 backdrop-blur-xl border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70">Profil Gücü</div>
                  <div className="text-3xl font-extrabold mt-1">{profile.strength}%</div>
                </div>
                <MatchScore score={profile.strength} size="lg" />
              </div>
              <div className="mt-4">
                <ProgressBar value={profile.strength} tone="primary" />
                <p className="text-xs text-white/70 mt-2">
                  Profilini %100'e çıkarmak için 2 alanı güncelle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Kariyer Eşleşme Skorun"
          value={`${overallScore}%`}
          tone="primary"
          icon={<Sparkles className="w-5 h-5" />}
          delta="+4 bu hafta"
        />
        <StatCard
          label="Yeni Staj Eşleşmeleri"
          value={`${newMatches}`}
          tone="purple"
          icon={<Briefcase className="w-5 h-5" />}
          delta="12 yeni"
        />
        <StatCard
          label="Aktif Başvurular"
          value={`${activeApps}`}
          tone="emerald"
          icon={<TrendingUp className="w-5 h-5" />}
          delta="3 inceleniyor"
        />
        <StatCard
          label="Mülakat Davetleri"
          value={`${interviewCount}`}
          tone="amber"
          icon={<Calendar className="w-5 h-5" />}
          delta="2 bu hafta"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Recommended */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <SectionTitle
              title="Sana Özel Eşleşmeler"
              description="En yüksek uyum skoruna sahip stajları gör."
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate("/app/matches")}
                >
                  Tümünü gör
                </Button>
              }
            />
            <div className="space-y-4">
              {topMatches.map((i) => (
                <InternshipCard key={i.id} internship={i} />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              title="Başvuru Durumu"
              description="Aktif süreçlerinin özeti."
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate("/app/applications")}
                >
                  Tümünü yönet
                </Button>
              }
            />
            <Card padded={false}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-ink-100">
                {[
                  { k: "Kayıtlı", v: 2, color: "bg-ink-200" },
                  { k: "Başvuruldu", v: 5, color: "bg-electric-500" },
                  { k: "İnceleniyor", v: 3, color: "bg-royal-500" },
                  { k: "Mülakat", v: 1, color: "bg-amber-500" },
                  { k: "Teklif", v: 1, color: "bg-emerald-500" },
                  { k: "Reddedildi", v: 0, color: "bg-rose-400" },
                ].map((c) => (
                  <div key={c.k} className="p-4 text-center">
                    <div className={`w-2.5 h-2.5 rounded-full mx-auto ${c.color}`} />
                    <div className="text-2xl font-extrabold text-midnight-950 mt-2">{c.v}</div>
                    <div className="text-[11px] text-ink-500">{c.k}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        {/* RIGHT: Side panels */}
        <div className="space-y-6">
          {/* Upcoming interviews */}
          <Card>
            <SectionTitle title="Yaklaşan Görüşmeler" />
            {upcomingInterviews.length === 0 ? (
              <p className="text-sm text-ink-500">Şu anda planlı bir görüşmen yok.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingInterviews.map((a) => {
                  const i = internships.find((x) => x.id === a.internshipId);
                  if (!i) return null;
                  return (
                    <li key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:border-electric-200 hover:bg-electric-50/40 transition">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ background: i.logoColor }}
                      >
                        {i.companyShort}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-midnight-950 truncate">
                          {i.title}
                        </div>
                        <div className="text-xs text-ink-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {a.nextAction}
                        </div>
                      </div>
                      <Badge tone="amber">Mülakat</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-3">
              <Button
                variant="outline"
                fullWidth
                size="sm"
                onClick={() => navigate("/app/messages")}
                iconLeft={<MessageCircle className="w-4 h-4" />}
              >
                Recruiter'larla Mesajlaş
              </Button>
            </div>
          </Card>

          {/* Skill progress */}
          <Card>
            <SectionTitle
              title="Yetenek Gelişimin"
              action={
                <button
                  className="text-xs font-semibold text-electric-700 hover:text-electric-800"
                  onClick={() => navigate("/app/profile")}
                >
                  Düzenle
                </button>
              }
            />
            <div className="space-y-3">
              {skillProgress.map((s) => (
                <ProgressBar key={s.name} value={s.level} label={s.name} showValue />
              ))}
            </div>
            <button
              onClick={() => {
                navigate("/app/roadmap");
                toast.info("Yol haritana yönlendirildin");
              }}
              className="mt-4 w-full text-sm font-semibold text-electric-700 hover:text-electric-800 inline-flex items-center justify-center gap-1"
            >
              Önerilen kurslara göz at <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>

          {/* Suggested companies */}
          <Card>
            <SectionTitle title="Önerilen Şirketler" />
            <ul className="space-y-3">
              {seedCompanies.slice(0, 4).map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: c.logoColor }}
                  >
                    {c.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-midnight-950 truncate">{c.name}</div>
                    <div className="text-xs text-ink-500 truncate">
                      {c.industry} · {c.openings} açık ilan
                    </div>
                  </div>
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => {
                      toast.success(`${c.name} takip ediliyor`);
                    }}
                  >
                    Takip et
                  </Button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Mentors */}
          <Card>
            <SectionTitle title="Mentor Önerileri" />
            <ul className="space-y-3">
              {seedMentors.slice(0, 3).map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.name} color={m.avatarColor} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-midnight-950 truncate">{m.name}</div>
                    <div className="text-xs text-ink-500 truncate">
                      {m.title} · {m.company}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      navigate("/app/messages");
                      toast.success(`${m.name} ile mesajlaşma başlatıldı`);
                    }}
                  >
                    Bağlan
                  </Button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Quick stats */}
          <Card className="bg-grad-soft border-electric-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-electric-100 flex items-center justify-center text-electric-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-midnight-950">Mesajlarını kontrol et</div>
                <div className="text-xs text-ink-600 mt-1">
                  Son 24 saatte {conversations.reduce((s, c) => s + c.unread, 0)} okunmamış mesaj.
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="mt-4"
              onClick={() => navigate("/app/messages")}
              iconLeft={<MessageCircle className="w-4 h-4" />}
            >
              Mesaj Kutusu
            </Button>
          </Card>
        </div>
      </div>

      {/* Quick checklist */}
      <Card>
        <SectionTitle title="Profilini Tamamla" description="Daha iyi eşleşmeler için bu adımları bitir." />
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { t: "Profil fotoğrafını yükle", done: true },
            { t: "En az 5 yetenek ekle", done: true },
            { t: "Bir proje ekle", done: false },
            { t: "Kariyer hedefini güncelle", done: false },
          ].map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                c.done ? "border-emerald-100 bg-emerald-50/40" : "border-ink-100"
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${c.done ? "text-emerald-600" : "text-ink-300"}`} />
              <span
                className={`text-sm ${c.done ? "line-through text-ink-500" : "text-midnight-950"}`}
              >
                {c.t}
              </span>
              {!c.done && (
                <button
                  onClick={() => navigate("/app/profile")}
                  className="ml-auto text-xs font-semibold text-electric-700 hover:text-electric-800"
                >
                  Tamamla →
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
  delta,
}: {
  label: string;
  value: string;
  tone: "primary" | "purple" | "emerald" | "amber";
  icon: React.ReactNode;
  delta?: string;
}) {
  const toneBg = {
    primary: "from-electric-400 to-electric-600 text-white",
    purple: "from-royal-400 to-royal-600 text-white",
    emerald: "from-emerald-400 to-emerald-600 text-white",
    amber: "from-amber-400 to-amber-600 text-white",
  }[tone];
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider">{label}</div>
          <div className="text-3xl font-extrabold text-midnight-950 mt-1">{value}</div>
          {delta && <div className="text-xs text-emerald-600 font-semibold mt-1">{delta}</div>}
        </div>
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${toneBg} flex items-center justify-center shadow-soft`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
