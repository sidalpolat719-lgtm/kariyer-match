import { useState } from "react";
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Flag,
  GraduationCap,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";
import { Card, SectionTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Modal } from "../components/ui/Modal";
import { useAppData } from "../context/AppDataContext";
import type { RoadmapStep } from "../types";
import { useToast } from "../context/ToastContext";
import { cn } from "../lib/cn";

const typeStyles: Record<RoadmapStep["type"], { icon: React.ReactNode; gradient: string; label: string }> = {
  skill: { icon: <Code2 className="w-4 h-4" />, gradient: "from-electric-400 to-electric-600", label: "Yetenek" },
  course: { icon: <BookOpen className="w-4 h-4" />, gradient: "from-royal-400 to-royal-600", label: "Kurs" },
  project: { icon: <Briefcase className="w-4 h-4" />, gradient: "from-emerald-400 to-emerald-600", label: "Proje" },
  milestone: { icon: <Flag className="w-4 h-4" />, gradient: "from-amber-400 to-rose-400", label: "Kilometre Taşı" },
};

const courses = [
  { name: "İleri Seviye TypeScript", provider: "PathMatch Akademi", duration: "12 saat", level: "İleri", color: "#7c3aed" },
  { name: "React Performance & Patterns", provider: "Lumen Studio", duration: "8 saat", level: "Orta", color: "#06b6d4" },
  { name: "Sistem Tasarımı 101", provider: "Helix Cloud", duration: "10 saat", level: "Başlangıç", color: "#10b981" },
];

const projects = [
  { name: "Kişisel Tasarım Sistemi", brief: "Kendi UI bileşen kütüphaneni yayınla.", time: "3 hafta", color: "#7c3aed" },
  { name: "Açık Kaynak Katkısı", brief: "Popüler bir React kütüphanesine PR aç.", time: "1 hafta", color: "#06b6d4" },
];

export default function RoadmapPage() {
  const { roadmap, setRoadmapStatus, addRoadmapStep } = useAppData();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<RoadmapStep, "id">>({
    title: "",
    description: "",
    status: "upcoming",
    type: "skill",
    meta: "",
  });
  const toast = useToast();

  const completed = roadmap.filter((r) => r.status === "completed").length;
  const inProgress = roadmap.filter((r) => r.status === "in_progress").length;
  const upcoming = roadmap.filter((r) => r.status === "upcoming").length;
  const progressPercent = Math.round((completed / roadmap.length) * 100);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-grad-primary text-white p-6 sm:p-8">
        <div className="absolute inset-0 bg-grad-mesh opacity-25 mix-blend-overlay" />
        <div className="relative grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
              <Target className="w-3.5 h-3.5 text-electric-200" /> Mevcut Hedef
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold">
              Frontend Junior · Ürün Odaklı Startup
            </h1>
            <p className="mt-2 text-white/80 max-w-lg">
              Önerilen yol haritası ile hedeflerine ulaşmak için kalan 6 adımı tamamla.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => setOpen(true)} iconLeft={<Plus className="w-4 h-4" />}>
                Adım Ekle
              </Button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 text-sm font-semibold"
                onClick={() => toast.info("AI tavsiye paneli yakında")}
              >
                <Sparkles className="w-4 h-4" /> AI Önerisi Al
              </button>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-2xl p-5 bg-white/10 backdrop-blur border border-white/20">
              <div className="text-[11px] uppercase tracking-wider text-white/70">Genel İlerleme</div>
              <div className="text-3xl font-extrabold mt-1">{progressPercent}%</div>
              <ProgressBar value={progressPercent} className="mt-3" tone="primary" />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <Mini label="Tamam" value={completed} />
                <Mini label="Devam" value={inProgress} />
                <Mini label="Sonraki" value={upcoming} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <Card>
        <SectionTitle title="İlerleme Zaman Çizelgesi" description="Adımlarına tıklayarak durumlarını güncelle." />
        <ol className="relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-electric-300 via-royal-300 to-ink-200" />
          {roadmap.map((step, i) => (
            <li key={step.id} className="relative pl-12 pb-6 last:pb-0">
              <div
                className={cn(
                  "absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-soft",
                  step.status === "completed"
                    ? "bg-emerald-500"
                    : step.status === "in_progress"
                    ? "bg-grad-cta animate-pulse"
                    : "bg-ink-300"
                )}
              >
                {step.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <div
                className={cn(
                  "rounded-2xl border p-4 transition",
                  step.status === "completed"
                    ? "border-emerald-100 bg-emerald-50/40"
                    : step.status === "in_progress"
                    ? "border-electric-200 bg-electric-50/30"
                    : "border-ink-100 bg-white"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-lg text-white inline-flex items-center justify-center bg-gradient-to-br ${typeStyles[step.type].gradient}`}
                      >
                        {typeStyles[step.type].icon}
                      </span>
                      <h3 className="font-bold text-midnight-950">{step.title}</h3>
                      <Badge tone="neutral">{typeStyles[step.type].label}</Badge>
                    </div>
                    <p className="text-sm text-ink-700 mt-2">{step.description}</p>
                    {step.meta && <div className="text-xs text-ink-500 mt-1">{step.meta}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    {step.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRoadmapStatus(step.id, "completed");
                          toast.success("Adım tamamlandı");
                        }}
                      >
                        Tamamlandı
                      </Button>
                    )}
                    {step.status === "upcoming" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setRoadmapStatus(step.id, "in_progress");
                          toast.info("Adım başlatıldı");
                        }}
                      >
                        Başla
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommended courses */}
        <Card>
          <SectionTitle title="Önerilen Kurslar" description="Eşleşme skorunu artıracak içerikler" />
          <ul className="space-y-3">
            {courses.map((c, i) => (
              <li
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl border border-ink-100 hover:border-electric-200 transition"
              >
                <div
                  className="w-12 h-12 rounded-xl text-white flex items-center justify-center"
                  style={{ background: c.color }}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-midnight-950 truncate">{c.name}</div>
                  <div className="text-xs text-ink-500">
                    {c.provider} · {c.duration} · {c.level}
                  </div>
                </div>
                <Button size="sm" onClick={() => toast.success(`${c.name} eklendi`)}>
                  Başla
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Suggested projects */}
        <Card>
          <SectionTitle title="Önerilen Projeler" description="Portfolyonu güçlendiren pratik fikirler" />
          <ul className="space-y-3">
            {projects.map((p, i) => (
              <li
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl border border-ink-100 hover:border-electric-200 transition"
              >
                <div
                  className="w-12 h-12 rounded-xl text-white flex items-center justify-center"
                  style={{ background: p.color }}
                >
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-midnight-950 truncate">{p.name}</div>
                  <div className="text-xs text-ink-500">{p.brief}</div>
                </div>
                <Badge tone="amber">{p.time}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yol Haritana Adım Ekle"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                if (!draft.title) {
                  toast.error("Başlık zorunlu");
                  return;
                }
                addRoadmapStep(draft);
                toast.success("Adım eklendi");
                setOpen(false);
                setDraft({ title: "", description: "", status: "upcoming", type: "skill", meta: "" });
              }}
            >
              Ekle
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">Başlık</label>
            <input
              className="input mt-1.5"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Örn: AWS Cloud Practitioner sertifikası"
            />
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea
              className="input mt-1.5 resize-none"
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tür</label>
              <select
                className="input mt-1.5"
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as RoadmapStep["type"] })}
              >
                <option value="skill">Yetenek</option>
                <option value="course">Kurs</option>
                <option value="project">Proje</option>
                <option value="milestone">Kilometre Taşı</option>
              </select>
            </div>
            <div>
              <label className="label">Durum</label>
              <select
                className="input mt-1.5"
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as RoadmapStep["status"] })}
              >
                <option value="upcoming">Sonraki</option>
                <option value="in_progress">Devam ediyor</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/15 py-2">
      <div className="text-base font-bold">{value}</div>
      <div className="text-[10px] text-white/70">{label}</div>
    </div>
  );
}
