import { useState } from "react";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Edit3,
  ExternalLink,
  GraduationCap,
  Link2,
  MapPin,
  Plus,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { Card, SectionTitle } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Modal } from "../components/ui/Modal";
import { useAppData } from "../context/AppDataContext";
import { SKILL_CATALOG } from "../data/seed";
import { useToast } from "../context/ToastContext";
import { cn } from "../lib/cn";

export default function ProfilePage() {
  const { profile, updateProfile, toggleSkill } = useAppData();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");

  const [draft, setDraft] = useState(profile);

  const filteredSkills = SKILL_CATALOG.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card padded={false} className="overflow-hidden">
        <div className="h-32 bg-grad-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-grad-mesh opacity-25 mix-blend-overlay" />
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-wrap items-end gap-5">
            <div className="rounded-3xl ring-4 ring-white shadow-card">
              <Avatar name={profile.fullName} color={profile.avatarColor} size="xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950">
                {profile.fullName}
              </h1>
              <p className="text-ink-700 font-medium mt-1">{profile.title}</p>
              <div className="text-sm text-ink-500 flex flex-wrap items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" /> {profile.university}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                iconLeft={<Edit3 className="w-4 h-4" />}
                onClick={() => {
                  setDraft(profile);
                  setEditOpen(true);
                }}
              >
                Profili Düzenle
              </Button>
              <Button
                onClick={() => {
                  toast.success("Profilin paylaşıldı");
                  navigator.clipboard?.writeText(window.location.href);
                }}
                iconLeft={<ExternalLink className="w-4 h-4" />}
              >
                Profili Paylaş
              </Button>
            </div>
          </div>

          {/* Profile strength */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl p-4 border border-ink-100 bg-white sm:col-span-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-midnight-950">Profil Gücü</span>
                <span className="text-electric-700 font-bold">{profile.strength}%</span>
              </div>
              <ProgressBar value={profile.strength} className="mt-2" />
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Tip done text="Temel bilgiler" />
                <Tip done text={`${profile.skills.length} yetenek`} />
                <Tip done={profile.projects.length > 0} text="Projeler" />
                <Tip done={profile.certificates.length > 0} text="Sertifikalar" />
              </div>
            </div>
            <Stat label="Toplam Eşleşme" value="42" />
            <Stat label="Profil Görüntülenme" value="318" tone="purple" />
          </div>
        </div>
      </Card>

      {/* Goal */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-grad-cta text-white flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <SectionTitle title="Kariyer Hedefim" />
            <p className="text-ink-700">{profile.goal}</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <SectionTitle title="Hakkımda" />
            <p className="text-ink-700 leading-relaxed">{profile.about}</p>
          </Card>

          {/* Skills */}
          <Card>
            <SectionTitle
              title="Yeteneklerim"
              description={`${profile.skills.length} yetenek seçili`}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  iconLeft={<Plus className="w-4 h-4" />}
                  onClick={() => setSkillsOpen(true)}
                >
                  Yetenek Ekle
                </Button>
              }
            />
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    toggleSkill(s);
                    toast.info("Yetenek kaldırıldı");
                  }}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-electric-50 text-electric-700 text-xs font-medium hover:bg-rose-50 hover:text-rose-700 transition"
                >
                  {s}
                  <X className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
              {profile.skills.length === 0 && (
                <p className="text-sm text-ink-500">Henüz yetenek eklemedin.</p>
              )}
            </div>
          </Card>

          {/* Experience */}
          <Card>
            <SectionTitle
              title="Deneyimlerim"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  iconLeft={<Plus className="w-4 h-4" />}
                  onClick={() => toast.info("Demo modunda deneyim ekleme yakında")}
                >
                  Ekle
                </Button>
              }
            />
            <ul className="space-y-4">
              {profile.experiences.map((e) => (
                <li key={e.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-grad-soft border border-electric-100 text-electric-700 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h4 className="font-bold text-midnight-950">{e.role}</h4>
                      <span className="text-sm text-ink-600">{e.company}</span>
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{e.period}</div>
                    <p className="text-sm text-ink-700 mt-1.5">{e.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Education */}
          <Card>
            <SectionTitle title="Eğitim" />
            <ul className="space-y-3">
              {profile.education.map((e) => (
                <li key={e.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-royal-50 text-royal-700 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-midnight-950">{e.school}</div>
                    <div className="text-sm text-ink-600">{e.program}</div>
                    <div className="text-xs text-ink-500">{e.period}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Projects */}
          <Card>
            <SectionTitle
              title="Projeler"
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  iconLeft={<Plus className="w-4 h-4" />}
                  onClick={() => toast.info("Demo modunda proje ekleme yakında")}
                >
                  Ekle
                </Button>
              }
            />
            <div className="grid sm:grid-cols-2 gap-3">
              {profile.projects.map((p) => (
                <div key={p.id} className="rounded-2xl p-4 border border-ink-100 hover:border-electric-200 transition">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-midnight-950">{p.name}</h4>
                    <button
                      onClick={() => toast.info("Proje kaldırma demo modunda inaktif")}
                      className="p-1.5 rounded-lg text-ink-400 hover:text-rose-600"
                      aria-label="Kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-ink-700 mt-1">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-ink-100 text-ink-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Certificates */}
          <Card>
            <SectionTitle title="Sertifikalar" />
            <ul className="grid sm:grid-cols-2 gap-3">
              {profile.certificates.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-ink-100 p-3 flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-midnight-950 text-sm">{c.name}</div>
                    <div className="text-xs text-ink-500">
                      {c.issuer} · {c.year}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Links */}
          <Card>
            <SectionTitle title="Portfolyo Bağlantıları" />
            <ul className="space-y-2">
              {profile.links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:border-electric-200 hover:bg-electric-50/40 transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-electric-50 text-electric-700 flex items-center justify-center">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-midnight-950">{l.label}</div>
                      <div className="text-xs text-ink-500 truncate">{l.url}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-ink-400" />
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          {/* Interests */}
          <Card>
            <SectionTitle title="Kariyer İlgi Alanları" />
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((i) => (
                <Badge key={i} tone="purple">
                  {i}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Match preferences */}
          <Card>
            <SectionTitle title="Eşleşme Tercihleri" />
            <PrefRow label="Çalışma Şekli" values={profile.preferences.workType} />
            <PrefRow label="Lokasyon" values={profile.preferences.locations} />
            <PrefRow label="Pozisyon Türü" values={profile.preferences.employmentType} />
          </Card>

          <Card className="bg-grad-soft border-electric-100">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-electric-600" />
              <div className="font-bold text-midnight-950">Profil İpucu</div>
            </div>
            <p className="text-sm text-ink-700 mt-2">
              Yeteneklerine "Sistem Tasarımı" eklediğinde 6 yeni eşleşme açılıyor.
            </p>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Profili Düzenle"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                updateProfile(draft);
                setEditOpen(false);
                toast.success("Profil güncellendi");
              }}
            >
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Ad Soyad</label>
            <input
              className="input mt-1.5"
              value={draft.fullName}
              onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Unvan</label>
            <input
              className="input mt-1.5"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Üniversite</label>
              <input
                className="input mt-1.5"
                value={draft.university}
                onChange={(e) => setDraft({ ...draft, university: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Lokasyon</label>
              <input
                className="input mt-1.5"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Kariyer Hedefin</label>
            <textarea
              className="input mt-1.5 resize-none"
              rows={3}
              value={draft.goal}
              onChange={(e) => setDraft({ ...draft, goal: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Hakkımda</label>
            <textarea
              className="input mt-1.5 resize-none"
              rows={4}
              value={draft.about}
              onChange={(e) => setDraft({ ...draft, about: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Skills modal */}
      <Modal
        open={skillsOpen}
        onClose={() => setSkillsOpen(false)}
        title="Yeteneklerini Güncelle"
        description="Eşleşme algoritması için en kritik veri yetenek havuzun."
        size="lg"
        footer={
          <Button onClick={() => setSkillsOpen(false)}>Tamam</Button>
        }
      >
        <input
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          placeholder="Yetenek ara..."
          className="input"
        />
        <div className="mt-4 flex flex-wrap gap-1.5 max-h-80 overflow-y-auto">
          {filteredSkills.map((s) => {
            const active = profile.skills.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSkill(s)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-full border transition",
                  active
                    ? "bg-electric-500 text-white border-electric-500"
                    : "bg-white text-ink-700 border-ink-200 hover:border-electric-400"
                )}
              >
                {active ? "✓ " : "+ "}
                {s}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

function Tip({ text, done }: { text: string; done?: boolean }) {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs", done ? "text-emerald-700" : "text-ink-500")}>
      <CheckCircle2
        className={cn("w-3.5 h-3.5", done ? "text-emerald-500" : "text-ink-300")}
      />
      {text}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string;
  tone?: "primary" | "purple";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 border",
        tone === "purple" ? "bg-royal-50 border-royal-100" : "bg-electric-50 border-electric-100"
      )}
    >
      <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">{label}</div>
      <div className="text-2xl font-extrabold text-midnight-950 mt-1">{value}</div>
    </div>
  );
}

function PrefRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="py-2 border-b last:border-b-0 border-ink-100">
      <div className="text-xs font-semibold text-ink-500 mb-1">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span key={v} className="chip">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
