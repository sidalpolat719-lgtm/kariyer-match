import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Share2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { Card, SectionTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { MatchScore } from "../components/ui/MatchScore";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import { Modal } from "../components/ui/Modal";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { PublicFooter } from "../components/layout/PublicFooter";
import { AppShell } from "../components/layout/AppShell";

export default function InternshipDetailPage() {
  const { id } = useParams();
  const { internships, saved, toggleSave, apply, applications } = useAppData();
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const internship = internships.find((i) => i.id === id);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  if (!internship) return <Navigate to="/app/matches" replace />;

  const isSaved = saved.includes(internship.id);
  const alreadyApplied = applications.some((a) => a.internshipId === internship.id);

  const similar = internships
    .filter((i) => i.id !== internship.id && i.industry === internship.industry)
    .slice(0, 3);

  const content = (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-midnight-950"
      >
        <ArrowLeft className="w-4 h-4" /> Geri dön
      </button>

      {/* Hero */}
      <Card padded={false} className="overflow-hidden">
        <div className="relative p-6 sm:p-8 bg-grad-soft border-b border-ink-100">
          <div className="absolute inset-0 -z-10 bg-grad-mesh opacity-50" />
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex items-start gap-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-card shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${internship.logoColor} 0%, ${internship.logoColor}cc 100%)`,
                }}
              >
                {internship.companyShort}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-electric-700">
                  {internship.industry}
                </div>
                <h1 className="h-display text-2xl sm:text-3xl mt-1">{internship.title}</h1>
                <div className="text-sm text-ink-700 mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {internship.company}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {internship.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> İlan: {internship.postedAt}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <Badge tone="primary">{internship.workType}</Badge>
                  <Badge tone="purple">{internship.employmentType}</Badge>
                  <Badge>{internship.experienceLevel}</Badge>
                  <Badge tone="emerald">{internship.companySize}</Badge>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3">
              <MatchScore score={internship.matchScore} size="lg" label />
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  iconLeft={isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  onClick={() => {
                    toggleSave(internship.id);
                    toast.success(isSaved ? "Kayıttan çıkarıldı" : "Listene eklendi");
                  }}
                >
                  {isSaved ? "Kaydedildi" : "Kaydet"}
                </Button>
                <Button
                  variant="outline"
                  iconLeft={<Share2 className="w-4 h-4" />}
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success("Bağlantı kopyalandı");
                  }}
                >
                  Paylaş
                </Button>
                <Button
                  size="md"
                  onClick={() => {
                    if (alreadyApplied) {
                      toast.info("Bu fırsata zaten başvurdun");
                      return;
                    }
                    setApplyOpen(true);
                  }}
                >
                  {alreadyApplied ? "Başvurdun" : "Başvuruyu Tamamla"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick info cards */}
        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <QuickInfo icon={<MapPin className="w-4 h-4" />} label="Lokasyon" value={internship.location} />
          <QuickInfo icon={<Clock className="w-4 h-4" />} label="Süre" value={internship.duration || "-"} />
          <QuickInfo
            icon={<Briefcase className="w-4 h-4" />}
            label="Çalışma"
            value={internship.workType}
          />
          <QuickInfo
            icon={<Calendar className="w-4 h-4" />}
            label="Son Başvuru"
            value={internship.deadline || "Açık"}
          />
          <QuickInfo
            icon={<Wallet className="w-4 h-4" />}
            label="Maaş"
            value={internship.stipend || "Belirtilmemiş"}
          />
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Why match */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-electric-500" />
              <h2 className="text-lg font-bold text-midnight-950">Neden eşleştin?</h2>
            </div>
            <ul className="space-y-2">
              {internship.matchReasons.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>

          {/* About */}
          <Card>
            <SectionTitle title="Pozisyon Hakkında" />
            <p className="text-ink-700 leading-relaxed">{internship.description}</p>
          </Card>

          {/* Responsibilities */}
          <Card>
            <SectionTitle title="Sorumluluklar" />
            <ul className="space-y-2">
              {internship.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="w-5 h-5 rounded-md bg-electric-50 text-electric-700 text-[11px] font-bold inline-flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <SectionTitle title="Aranan Yetenekler" />
              <div className="flex flex-wrap gap-1.5">
                {internship.skills.map((s) => (
                  <span key={s} className="chip-primary">
                    {s}
                  </span>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle title="Tercih Sebebi" />
              <div className="flex flex-wrap gap-1.5">
                {(internship.niceToHave || []).map((s) => (
                  <span key={s} className="chip-purple">
                    {s}
                  </span>
                ))}
                {(!internship.niceToHave || internship.niceToHave.length === 0) && (
                  <p className="text-sm text-ink-500">Belirtilmemiş.</p>
                )}
              </div>
            </Card>
          </div>

          <Card>
            <SectionTitle title="Bu pozisyonda ne öğreneceksin?" />
            <ul className="grid sm:grid-cols-2 gap-2">
              {internship.learnings.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-2 text-sm text-ink-700 p-3 rounded-xl bg-grad-soft border border-electric-100"
                >
                  <GraduationCap className="w-4 h-4 text-electric-600 mt-0.5 shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
          </Card>

          {/* Company */}
          <Card>
            <SectionTitle title={`${internship.company} Hakkında`} />
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold"
                style={{ background: internship.logoColor }}
              >
                {internship.companyShort}
              </div>
              <p className="text-sm text-ink-700 leading-relaxed">{internship.about}</p>
            </div>
          </Card>
        </div>

        {/* Side */}
        <div className="space-y-6">
          <Card className="bg-grad-primary text-white border-0">
            <div className="text-xs font-bold uppercase tracking-wider text-electric-200">
              Kariyer Eşleşme
            </div>
            <div className="text-3xl font-extrabold mt-1">%{internship.matchScore} uyumlu</div>
            <p className="text-sm text-white/80 mt-2">
              "Bu fırsat senin yeteneklerinle %{internship.matchScore} uyumlu". Hemen başvurarak
              farkını ortaya koy.
            </p>
            <Button
              variant="primary"
              fullWidth
              className="mt-4"
              onClick={() => {
                if (alreadyApplied) toast.info("Zaten başvurdun");
                else setApplyOpen(true);
              }}
            >
              {alreadyApplied ? "Başvuruldu" : "Başvuruyu Tamamla"}
            </Button>
          </Card>

          <Card>
            <SectionTitle title="Benzer Fırsatlar" />
            <div className="space-y-3">
              {similar.length === 0 && <p className="text-sm text-ink-500">Şu anda benzer ilan yok.</p>}
              {similar.map((s) => (
                <Link
                  key={s.id}
                  to={`/internships/${s.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:border-electric-200 hover:bg-electric-50/40 transition"
                >
                  <div
                    className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center"
                    style={{ background: s.logoColor }}
                  >
                    {s.companyShort}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-midnight-950 truncate">{s.title}</div>
                    <div className="text-xs text-ink-500 truncate">
                      {s.company} · {s.location}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">%{s.matchScore}</span>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="İpucu" />
            <p className="text-sm text-ink-700">
              Başvurunda neden bu pozisyona uygun olduğunu 2–3 cümleyle özetlemen kabul oranını
              %38 artırıyor.
            </p>
          </Card>
        </div>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Başvurunu tamamla"
        description={`${internship.title} · ${internship.company}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setApplyOpen(false)}>
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                apply(internship.id);
                setApplyOpen(false);
                toast.success("Başvurun gönderildi", "Recruiter ile iletişime geçilecek.");
              }}
            >
              Gönder
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl p-3 bg-electric-50 border border-electric-100 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-electric-700 mt-0.5" />
            <div className="text-xs text-ink-700">
              Profilin %{internship.matchScore} uyum gösteriyor. Birkaç cümlelik ön yazı eklersen
              kabul oranın artar.
            </div>
          </div>
          <div>
            <label className="label">Profil özeti</label>
            <p className="text-xs text-ink-500 mt-1">
              {`Ada Yılmaz · Bilgisayar Mühendisliği · ${internship.skills.slice(0, 3).join(", ")}`}
            </p>
          </div>
          <div>
            <label className="label">Ön yazı (opsiyonel)</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Bu pozisyona neden uygun olduğunu ve şirkete ne katacağını anlat..."
              className="input mt-1.5 resize-none"
            />
            <div className="text-[11px] text-ink-500 mt-1 text-right">{coverLetter.length}/600</div>
          </div>
        </div>
      </Modal>
    </div>
  );

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-white">
        <PublicNavbar />
        <div className="pt-28 pb-16 section">{content}</div>
        <PublicFooter />
      </div>
    );
  }
  return <AppShell>{content}</AppShell>;
}

function QuickInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-ink-100 p-3 flex items-center gap-3 bg-white">
      <div className="w-9 h-9 rounded-lg bg-ink-50 text-electric-700 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-ink-500 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-bold text-midnight-950 truncate">{value}</div>
      </div>
    </div>
  );
}
