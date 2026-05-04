import { useMemo, useState } from "react";
import {
  Bookmark,
  Briefcase,
  Filter,
  GraduationCap,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Search,
  Star,
  StickyNote,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Modal } from "../../components/ui/Modal";
import { stageLabels } from "../../data/companySeed";
import type { TalentCandidate } from "../../types/company";
import { cn } from "../../lib/cn";

const allWorkTypes = ["Uzaktan", "Hibrit", "Ofis"];
const allCities = ["İstanbul", "Ankara", "İzmir", "Bursa"];
const allStages = ["new", "screening", "interview", "offer", "hired"];

export default function CompanyTalentPage() {
  const { talent, toggleStarCandidate, setCandidateStage, rejectCandidate, addNoteToCandidate, inviteCandidate } =
    useCompanyData();
  const toast = useToast();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [openFilters, setOpenFilters] = useState(true);
  const [selected, setSelected] = useState<TalentCandidate | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const [filters, setFilters] = useState({
    workType: [] as string[],
    cities: [] as string[],
    stages: [] as string[],
    starredOnly: false,
    minScore: 70,
    expMin: 0,
    skills: [] as string[],
  });

  const allSkills = useMemo(() => {
    const s = new Set<string>();
    talent.forEach((t) => t.skills.forEach((k) => s.add(k)));
    return Array.from(s).sort();
  }, [talent]);

  const filtered = useMemo(() => {
    let list = [...talent];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.headline.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filters.workType.length) list = list.filter((c) => filters.workType.includes(c.workType));
    if (filters.cities.length) list = list.filter((c) => filters.cities.includes(c.city));
    if (filters.stages.length) list = list.filter((c) => filters.stages.includes(c.stage));
    if (filters.starredOnly) list = list.filter((c) => c.starred);
    list = list.filter((c) => c.matchScore >= filters.minScore);
    list = list.filter((c) => c.experienceYears >= filters.expMin);
    if (filters.skills.length)
      list = list.filter((c) => filters.skills.every((s) => c.skills.includes(s)));
    list.sort((a, b) => b.matchScore - a.matchScore);
    return list;
  }, [talent, search, filters]);

  function toggleArr<T extends string>(key: keyof typeof filters, value: T) {
    setFilters((prev) => {
      const arr = prev[key] as T[];
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
            Aday Havuzu
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            <strong className="text-midnight-950">{filtered.length}</strong> aday · AI tarafından
            şirket profilinize göre sıralandı
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-white border border-ink-200">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-1.5 rounded-lg transition",
                view === "grid" ? "bg-royal-50 text-royal-700" : "text-ink-500 hover:text-midnight-950"
              )}
              aria-label="Kart görünümü"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-1.5 rounded-lg transition",
                view === "list" ? "bg-royal-50 text-royal-700" : "text-ink-500 hover:text-midnight-950"
              )}
              aria-label="Liste görünümü"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button
            variant="outline"
            iconLeft={<Filter className="w-4 h-4" />}
            onClick={() => setOpenFilters((v) => !v)}
          >
            Filtreler
          </Button>
          <Button
            iconLeft={<UserPlus className="w-4 h-4" />}
            onClick={() => setInviteOpen(true)}
            className="!bg-grad-corp-cta !shadow-[0_14px_40px_-16px_rgba(139,92,246,0.55)]"
          >
            Aday Davet Et
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="grid lg:grid-cols-12 gap-4">
        {openFilters && (
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-ink-100 p-5 h-fit shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-midnight-950">Filtreler</h3>
              <button
                onClick={() =>
                  setFilters({
                    workType: [],
                    cities: [],
                    stages: [],
                    starredOnly: false,
                    minScore: 70,
                    expMin: 0,
                    skills: [],
                  })
                }
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Sıfırla
              </button>
            </div>

            <FilterBlock title="Eşleşme Skoru">
              <div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) =>
                    setFilters({ ...filters, minScore: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-royal-500"
                />
                <div className="flex items-center justify-between text-[10px] text-ink-500 mt-1">
                  <span>50%</span>
                  <span className="font-bold text-royal-700">≥ %{filters.minScore}</span>
                  <span>100%</span>
                </div>
              </div>
            </FilterBlock>

            <FilterBlock title="Deneyim (Yıl)">
              <div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={filters.expMin}
                  onChange={(e) =>
                    setFilters({ ...filters, expMin: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-royal-500"
                />
                <div className="text-[10px] text-ink-500 mt-1 text-center">
                  En az <span className="font-bold text-royal-700">{filters.expMin}+</span> yıl
                </div>
              </div>
            </FilterBlock>

            <FilterBlock title="Çalışma Şekli">
              <div className="flex flex-wrap gap-1.5">
                {allWorkTypes.map((w) => {
                  const active = filters.workType.includes(w);
                  return (
                    <button
                      key={w}
                      onClick={() => toggleArr("workType", w)}
                      className={cn(
                        "text-[11px] font-medium px-2.5 py-1 rounded-full border transition",
                        active
                          ? "bg-royal-500 text-white border-royal-500"
                          : "bg-white text-ink-700 border-ink-200 hover:border-royal-400"
                      )}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </FilterBlock>

            <FilterBlock title="Şehir">
              <div className="flex flex-wrap gap-1.5">
                {allCities.map((c) => {
                  const active = filters.cities.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleArr("cities", c)}
                      className={cn(
                        "text-[11px] font-medium px-2.5 py-1 rounded-full border transition",
                        active
                          ? "bg-midnight-900 text-white border-midnight-900"
                          : "bg-white text-ink-700 border-ink-200 hover:border-midnight-700"
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </FilterBlock>

            <FilterBlock title="Pipeline Aşaması">
              <div className="flex flex-wrap gap-1.5">
                {allStages.map((s) => {
                  const active = filters.stages.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleArr("stages", s)}
                      className={cn(
                        "text-[11px] font-medium px-2.5 py-1 rounded-full border transition",
                        active
                          ? "bg-electric-500 text-white border-electric-500"
                          : "bg-white text-ink-700 border-ink-200 hover:border-electric-400"
                      )}
                    >
                      {stageLabels[s]}
                    </button>
                  );
                })}
              </div>
            </FilterBlock>

            <FilterBlock title="Yetenekler">
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {allSkills.map((s) => {
                  const active = filters.skills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleArr("skills", s)}
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-md border transition",
                        active
                          ? "bg-royal-50 text-royal-700 border-royal-200"
                          : "bg-white text-ink-600 border-ink-200 hover:border-royal-300"
                      )}
                    >
                      {active ? "✓ " : ""}
                      {s}
                    </button>
                  );
                })}
              </div>
            </FilterBlock>

            <label className="mt-2 flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.starredOnly}
                onChange={(e) => setFilters({ ...filters, starredOnly: e.target.checked })}
                className="w-4 h-4 rounded text-royal-500 focus:ring-royal-400"
              />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Sadece yıldızlı adaylar
            </label>
          </aside>
        )}

        {/* Main content */}
        <div className={cn(openFilters ? "lg:col-span-9" : "lg:col-span-12")}>
          <div className="bg-white rounded-2xl border border-ink-100 p-3 shadow-soft mb-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-ink-400 ml-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim, başlık veya yetenek ara..."
              className="flex-1 bg-transparent outline-none text-sm py-1.5"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-ink-200 py-16 text-center">
              <div className="text-ink-500 text-sm">Bu filtrelerde aday bulunamadı.</div>
            </div>
          ) : view === "grid" ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  onSelect={() => setSelected(c)}
                  onStar={() => {
                    toggleStarCandidate(c.id);
                    toast.success(c.starred ? "Yıldız kaldırıldı" : "Yıldıza eklendi");
                  }}
                  onShortlist={() => {
                    setCandidateStage(c.id, "screening");
                    toast.success(`${c.name.split(" ")[0]} kısa listeye eklendi`);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden shadow-soft">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-ink-500 bg-ink-50/50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-bold">Aday</th>
                    <th className="text-left px-2 py-2.5 font-bold">Yetenekler</th>
                    <th className="text-right px-2 py-2.5 font-bold">Skor</th>
                    <th className="text-left px-2 py-2.5 font-bold">Aşama</th>
                    <th className="px-2 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t border-ink-100 hover:bg-royal-50/20 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.name} color={c.avatarColor} />
                          <div className="min-w-0">
                            <div className="font-bold text-midnight-950">{c.name}</div>
                            <div className="text-[11px] text-ink-500">{c.university}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-royal-50 text-royal-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                          %{c.matchScore}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className="text-[11px] font-semibold text-ink-700">
                          {stageLabels[c.stage]}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                          Detay
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Candidate detail drawer */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        size="lg"
        title={selected?.name || ""}
        description={selected?.headline || ""}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <Stat label="Eşleşme" value={`%${selected.matchScore}`} />
              <Stat label="Deneyim" value={`${selected.experienceYears}+ yıl`} />
              <Stat label="Maaş Beklentisi" value={selected.salaryExpectation || "—"} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Info icon={<GraduationCap className="w-4 h-4" />} label="Eğitim" value={selected.university} />
              <Info icon={<MapPin className="w-4 h-4" />} label="Şehir" value={selected.city} />
              <Info icon={<Mail className="w-4 h-4" />} label="E-posta" value={selected.email} />
              <Info icon={<Briefcase className="w-4 h-4" />} label="Müsaitlik" value={selected.availability} />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                Yetenekler
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-royal-50 text-royal-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2 flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5" /> Recruiter Notu
              </div>
              <textarea
                value={noteText || selected.notes || ""}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Aday hakkında not..."
                rows={3}
                className="input resize-none"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addNoteToCandidate(selected.id, noteText || selected.notes || "");
                    toast.success("Not kaydedildi");
                    setNoteText("");
                  }}
                >
                  Notu Kaydet
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-ink-100">
              <Button
                onClick={() => {
                  setCandidateStage(selected.id, "interview");
                  toast.success(`${selected.name.split(" ")[0]} mülakata davet edildi`);
                  setSelected(null);
                }}
                iconLeft={<UserCheck className="w-4 h-4" />}
                className="!bg-grad-corp-cta"
              >
                Mülakata Davet Et
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCandidateStage(selected.id, "screening");
                  toast.success(`${selected.name.split(" ")[0]} kısa listeye alındı`);
                }}
                iconLeft={<Bookmark className="w-4 h-4" />}
              >
                Kısa Listeye Al
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("Mesajlaşma penceresi açıldı")}
                iconLeft={<MessageCircle className="w-4 h-4" />}
              >
                Mesaj Gönder
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  rejectCandidate(selected.id);
                  toast.info("Aday reddedildi");
                  setSelected(null);
                }}
                className="!text-rose-600 ml-auto"
              >
                Reddet
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Invite Modal */}
      <InviteCandidateModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={(d) => {
          inviteCandidate(d);
          toast.success(`${d.name} havuza davet edildi`);
          setInviteOpen(false);
        }}
      />
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-b last:border-b-0 border-ink-100">
      <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2.5">{title}</div>
      {children}
    </div>
  );
}

function CandidateCard({
  candidate,
  onSelect,
  onStar,
  onShortlist,
}: {
  candidate: TalentCandidate;
  onSelect: () => void;
  onStar: () => void;
  onShortlist: () => void;
}) {
  return (
    <article className="bg-white rounded-2xl border border-ink-100 p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar name={candidate.name} color={candidate.avatarColor} size="lg" />
          <div className="min-w-0">
            <div className="font-bold text-midnight-950">{candidate.name}</div>
            <div className="text-xs text-ink-500 truncate">{candidate.headline}</div>
          </div>
        </div>
        <button
          onClick={onStar}
          className={cn(
            "p-1.5 rounded-lg transition",
            candidate.starred ? "text-amber-500" : "text-ink-400 hover:text-amber-500"
          )}
          aria-label="Yıldızla"
        >
          <Star className={cn("w-4 h-4", candidate.starred && "fill-amber-400")} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Mini value={`%${candidate.matchScore}`} label="Eşleşme" />
        <Mini value={`${candidate.experienceYears}y`} label="Deneyim" />
        <Mini value={candidate.workType} label="Çalışma" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {candidate.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-royal-50 text-royal-700"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {candidate.city}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-ink-100 font-semibold text-ink-700">
          {stageLabels[candidate.stage]}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onSelect} className="flex-1">
          Profil
        </Button>
        <Button size="sm" onClick={onShortlist} className="flex-1 !bg-grad-corp-cta">
          Kısa Listeye Al
        </Button>
      </div>
    </article>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-ink-50/60 py-1.5">
      <div className="text-xs font-bold text-midnight-950">{value}</div>
      <div className="text-[9px] text-ink-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-royal-50 p-3 border border-royal-100 text-center">
      <div className="text-[10px] uppercase tracking-wider font-bold text-royal-700">{label}</div>
      <div className="text-lg font-extrabold text-midnight-950 mt-1">{value}</div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-100 p-3 flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-ink-50 text-royal-700 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
        <div className="text-sm font-semibold text-midnight-950 truncate">{value}</div>
      </div>
    </div>
  );
}

function InviteCandidateModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (data: { name: string; email: string; postingTitle: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [postingTitle, setPostingTitle] = useState("Frontend Geliştirici Stajyer");
  const toast = useToast();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Aday Davet Et"
      description="LinkedIn veya e-posta üzerinden bir aday davet et."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Vazgeç
          </Button>
          <Button
            onClick={() => {
              if (!name || !email) {
                toast.error("Ad ve e-posta zorunlu");
                return;
              }
              onInvite({ name, email, postingTitle });
              setName("");
              setEmail("");
            }}
            className="!bg-grad-corp-cta"
          >
            Davet Gönder
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="label">Ad Soyad</label>
          <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">E-posta</label>
          <input
            type="email"
            className="input mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Pozisyon</label>
          <input
            className="input mt-1.5"
            value={postingTitle}
            onChange={(e) => setPostingTitle(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}

void X;
void MoreHorizontal;
void Phone;
