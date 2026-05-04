import { useState } from "react";
import {
  Award,
  Building2,
  Edit3,
  ExternalLink,
  Eye,
  Globe,
  Heart,
  MapPin,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";

export default function CompanyBrandPage() {
  const { profile, updateProfile, postings } = useCompanyData();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [perk, setPerk] = useState("");
  const [tech, setTech] = useState("");

  const activePostings = postings.filter((p) => p.status === "active");

  return (
    <div className="space-y-5">
      {/* Cover */}
      <div className="rounded-3xl overflow-hidden border border-ink-100 shadow-soft bg-white">
        <div
          className="h-40 sm:h-56 relative"
          style={{
            background: "linear-gradient(135deg, #0d1a3a 0%, #4c1d95 50%, #d946ef 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(at 0% 0%, #06b6d4 0px, transparent 50%), radial-gradient(at 100% 100%, #f59e0b 0px, transparent 50%)",
            }}
          />
          <button
            onClick={() => toast.info("Cover yükleme demo modunda inaktif")}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-semibold hover:bg-white/25"
          >
            <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Görseli Değiştir
          </button>
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-wrap items-end gap-4">
            <div
              className="w-24 h-24 rounded-3xl ring-4 ring-white shadow-card flex items-center justify-center text-white text-3xl font-extrabold shrink-0"
              style={{
                background: `linear-gradient(135deg, ${profile.brandColor}, ${profile.brandColor}cc)`,
              }}
            >
              {profile.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950">
                {profile.name}
              </h1>
              <p className="text-ink-700 mt-1">{profile.tagline}</p>
              <div className="text-sm text-ink-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="w-4 h-4" /> {profile.industry}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-4 h-4" /> {profile.size}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {profile.headquarters}
                </span>
                <a
                  href={`https://${profile.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-royal-700 hover:text-royal-800"
                >
                  <Globe className="w-4 h-4" /> {profile.website}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                iconLeft={<Eye className="w-4 h-4" />}
                onClick={() => toast.info("Aday görünümü yeni sekmede açıldı")}
              >
                Aday Görünümü
              </Button>
              <Button
                onClick={() => {
                  setDraft(profile);
                  setEditOpen(true);
                }}
                iconLeft={<Edit3 className="w-4 h-4" />}
                className="!bg-grad-corp-cta"
              >
                Düzenle
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <BrandStat label="Takipçi" value={profile.followers.toLocaleString("tr-TR")} icon={<Heart className="w-4 h-4" />} />
            <BrandStat label="İşveren Puanı" value={`${profile.rating}/5`} icon={<Star className="w-4 h-4" />} />
            <BrandStat label="Aktif İlan" value={String(activePostings.length)} icon={<Sparkles className="w-4 h-4" />} />
            <BrandStat label="Toplam İşe Alım" value={String(profile.hires)} icon={<Award className="w-4 h-4" />} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* About */}
          <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="font-bold text-midnight-950 text-lg">Hakkımızda</h2>
                <p className="text-xs text-ink-500">Kültür ve değer önermeniz</p>
              </div>
              <button
                onClick={() => {
                  setDraft(profile);
                  setEditOpen(true);
                }}
                className="text-xs font-semibold text-royal-700 hover:text-royal-800"
              >
                Düzenle
              </button>
            </div>
            <p className="text-ink-700 leading-relaxed">{profile.about}</p>
          </div>

          {/* Perks */}
          <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
            <h2 className="font-bold text-midnight-950 text-lg mb-4">Avantajlar</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {profile.perks.map((p) => (
                <div
                  key={p}
                  className="rounded-xl border border-royal-100 bg-grad-corp-soft p-3 flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-grad-corp-cta text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-midnight-950 flex-1">{p}</span>
                  <button
                    onClick={() => {
                      updateProfile({ perks: profile.perks.filter((x) => x !== p) });
                      toast.info("Avantaj kaldırıldı");
                    }}
                    className="opacity-0 group-hover:opacity-100 text-ink-400 hover:text-rose-600 p-1 transition"
                    aria-label="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={perk}
                onChange={(e) => setPerk(e.target.value)}
                placeholder="Yeni avantaj ekle..."
                className="input flex-1 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && perk.trim()) {
                    updateProfile({ perks: [...profile.perks, perk.trim()] });
                    setPerk("");
                    toast.success("Avantaj eklendi");
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (perk.trim()) {
                    updateProfile({ perks: [...profile.perks, perk.trim()] });
                    setPerk("");
                    toast.success("Avantaj eklendi");
                  }
                }}
                iconLeft={<Plus className="w-4 h-4" />}
              >
                Ekle
              </Button>
            </div>
          </div>

          {/* Tech stack */}
          <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
            <h2 className="font-bold text-midnight-950 text-lg mb-4">Teknoloji Stack</h2>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {profile.techStack.map((t) => (
                <span
                  key={t}
                  className="group inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-electric-50 text-electric-700"
                >
                  {t}
                  <button
                    onClick={() => {
                      updateProfile({ techStack: profile.techStack.filter((x) => x !== t) });
                      toast.info("Teknoloji kaldırıldı");
                    }}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                placeholder="React, Node.js..."
                className="input flex-1 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tech.trim()) {
                    updateProfile({ techStack: [...profile.techStack, tech.trim()] });
                    setTech("");
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (tech.trim()) {
                    updateProfile({ techStack: [...profile.techStack, tech.trim()] });
                    setTech("");
                  }
                }}
              >
                Ekle
              </Button>
            </div>
          </div>

          {/* Active postings widget */}
          <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-soft">
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-bold text-midnight-950 text-lg">Açık Pozisyonlarımız</h2>
              <span className="text-xs text-ink-500">Aday görünümünde gösterilir</span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {activePostings.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-ink-100 p-4 hover:border-royal-200 transition"
                >
                  <div className="text-sm font-bold text-midnight-950">{p.title}</div>
                  <div className="text-[11px] text-ink-500 mt-0.5">
                    {p.department} · {p.location}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-royal-50 text-royal-700 font-semibold">
                      {p.workType}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-electric-50 text-electric-700 font-semibold">
                      {p.employmentType}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Brand health */}
          <div
            className="rounded-3xl p-5 text-white"
            style={{
              backgroundImage: "linear-gradient(135deg,#4c1d95 0%, #7c3aed 50%, #d946ef 100%)",
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-200">
              Marka Sağlığı
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
              <span className="text-3xl font-extrabold">{profile.rating}</span>
              <span className="text-sm text-white/70">/ 5</span>
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="Çalışma kültürü" v={92} />
              <Bar label="Mülakat deneyimi" v={88} />
              <Bar label="Maaş & yan haklar" v={78} />
              <Bar label="Kariyer gelişimi" v={84} />
            </div>
            <button
              onClick={() => toast.info("Detaylı işveren marka raporu hazırlandı")}
              className="mt-4 w-full text-xs font-bold py-2 rounded-lg bg-white text-midnight-950 hover:bg-white/90"
            >
              Detaylı Raporu Gör
            </button>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-soft">
            <h3 className="font-bold text-midnight-950 mb-3">Hızlı Eylem</h3>
            <div className="space-y-2">
              <Button
                fullWidth
                variant="outline"
                onClick={() => toast.success("Şirket sayfası bağlantısı kopyalandı")}
                iconLeft={<ExternalLink className="w-4 h-4" />}
              >
                Sayfa Bağlantısını Paylaş
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => toast.info("Görsel yükleme demo modunda inaktif")}
              >
                Şirket Galerisi
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => toast.info("Çalışan referansları yakında")}
              >
                Çalışan Referansları
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Şirket Profilini Düzenle"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                updateProfile(draft);
                toast.success("Şirket profili güncellendi");
                setEditOpen(false);
              }}
              className="!bg-grad-corp-cta"
            >
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">Şirket Adı</label>
            <input
              className="input mt-1.5"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input
              className="input mt-1.5"
              value={draft.tagline}
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Sektör</label>
              <input
                className="input mt-1.5"
                value={draft.industry}
                onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Çalışan Sayısı</label>
              <input
                className="input mt-1.5"
                value={draft.size}
                onChange={(e) => setDraft({ ...draft, size: e.target.value })}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Web Site</label>
              <input
                className="input mt-1.5"
                value={draft.website}
                onChange={(e) => setDraft({ ...draft, website: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Merkez</label>
              <input
                className="input mt-1.5"
                value={draft.headquarters}
                onChange={(e) => setDraft({ ...draft, headquarters: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Hakkımızda</label>
            <textarea
              rows={5}
              className="input mt-1.5 resize-none"
              value={draft.about}
              onChange={(e) => setDraft({ ...draft, about: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Marka Rengi</label>
            <input
              type="color"
              value={draft.brandColor}
              onChange={(e) => setDraft({ ...draft, brandColor: e.target.value })}
              className="mt-1.5 w-20 h-10 rounded-lg border border-ink-200 cursor-pointer"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function BrandStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 p-4 bg-white">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-grad-corp-soft text-royal-700 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      </div>
      <div className="text-2xl font-extrabold text-midnight-950 mt-1">{value}</div>
    </div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-white/80">{label}</span>
        <span className="font-bold">%{v}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
