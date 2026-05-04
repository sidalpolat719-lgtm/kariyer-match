import { useMemo, useState } from "react";
import { CalendarRange, MessageCircle, Star, Trash2 } from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Avatar } from "../../components/ui/Avatar";
import { Tabs } from "../../components/ui/Tabs";
import { useToast } from "../../context/ToastContext";
import { stageLabels } from "../../data/companySeed";
import type { PipelineStage, TalentCandidate } from "../../types/company";
import { cn } from "../../lib/cn";

const columns: { id: PipelineStage; label: string; gradient: string; accent: string; description: string }[] = [
  { id: "new", label: "Yeni Başvuru", gradient: "from-slate-400 to-slate-500", accent: "border-t-slate-400", description: "Henüz değerlendirilmedi" },
  { id: "screening", label: "Ön Değerlendirme", gradient: "from-electric-400 to-electric-600", accent: "border-t-electric-400", description: "Kısa listeye alındı" },
  { id: "interview", label: "Mülakat", gradient: "from-amber-400 to-amber-500", accent: "border-t-amber-400", description: "Görüşmeler planlandı" },
  { id: "offer", label: "Teklif", gradient: "from-royal-400 to-royal-600", accent: "border-t-royal-400", description: "Teklif gönderildi" },
  { id: "hired", label: "İşe Alındı", gradient: "from-emerald-400 to-emerald-600", accent: "border-t-emerald-500", description: "Sözleşme imzalandı" },
  { id: "rejected", label: "Reddedildi", gradient: "from-rose-400 to-rose-500", accent: "border-t-rose-400", description: "Süreç sonlandırıldı" },
];

export default function CompanyPipelinePage() {
  const { talent, postings, setCandidateStage, rejectCandidate, toggleStarCandidate } = useCompanyData();
  const toast = useToast();
  const [postingFilter, setPostingFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (postingFilter === "all") return talent;
    return talent.filter((c) => c.appliedRoleId === postingFilter);
  }, [talent, postingFilter]);

  const grouped = useMemo(() => {
    const map: Record<PipelineStage, TalentCandidate[]> = {
      new: [],
      screening: [],
      interview: [],
      offer: [],
      hired: [],
      rejected: [],
    };
    filtered.forEach((c) => map[c.stage].push(c));
    return map;
  }, [filtered]);

  const totalActive = filtered.filter((c) => c.stage !== "rejected" && c.stage !== "hired").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
            Aday Pipeline
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            <strong className="text-midnight-950">{totalActive}</strong> aktif aday süreçte ·
            Drag yerine durum değiştir butonu kullan
          </p>
        </div>
        <Tabs
          tabs={[
            { id: "all", label: "Tüm İlanlar" },
            ...postings
              .filter((p) => p.status === "active")
              .slice(0, 4)
              .map((p) => ({ id: p.id, label: p.title.split(" ").slice(0, 2).join(" ") })),
          ]}
          active={postingFilter}
          onChange={setPostingFilter}
          size="sm"
        />
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          className="grid gap-4 min-w-full"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(280px, 1fr))`,
          }}
        >
          {columns.map((col) => (
            <section
              key={col.id}
              className={cn(
                "bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden flex flex-col",
                "border-t-[3px]",
                col.accent
              )}
            >
              <header className="p-4 border-b border-ink-100 bg-gradient-to-b from-ink-50/40 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-midnight-950">{col.label}</div>
                    <div className="text-[11px] text-ink-500">{col.description}</div>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-1 rounded-md text-white bg-gradient-to-br",
                      col.gradient
                    )}
                  >
                    {grouped[col.id].length}
                  </span>
                </div>
              </header>

              <div className="p-3 flex-1 min-h-[260px] space-y-3 overflow-y-auto max-h-[60vh]">
                {grouped[col.id].length === 0 && (
                  <div className="text-xs text-ink-400 italic py-6 text-center">
                    Bu aşamada aday yok
                  </div>
                )}
                {grouped[col.id].map((c) => (
                  <PipelineCard
                    key={c.id}
                    candidate={c}
                    onStar={() => {
                      toggleStarCandidate(c.id);
                      toast.success(c.starred ? "Yıldız kaldırıldı" : "Yıldıza eklendi");
                    }}
                    onChangeStage={(stage) => {
                      setCandidateStage(c.id, stage);
                      toast.success(`${c.name.split(" ")[0]} → ${stageLabels[stage]}`);
                    }}
                    onReject={() => {
                      rejectCandidate(c.id);
                      toast.info(`${c.name.split(" ")[0]} reddedildi`);
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineCard({
  candidate,
  onStar,
  onChangeStage,
  onReject,
}: {
  candidate: TalentCandidate;
  onStar: () => void;
  onChangeStage: (s: PipelineStage) => void;
  onReject: () => void;
}) {
  const toast = useToast();
  return (
    <article className="rounded-xl border border-ink-100 bg-white p-3 hover:border-royal-200 hover:shadow-card transition">
      <div className="flex items-start gap-3">
        <Avatar name={candidate.name} color={candidate.avatarColor} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-sm font-bold text-midnight-950 truncate">
              {candidate.name}
            </span>
            <button
              onClick={onStar}
              className={cn(
                "p-0.5 transition",
                candidate.starred ? "text-amber-500" : "text-ink-300 hover:text-amber-500"
              )}
              aria-label="Yıldızla"
            >
              <Star className={cn("w-3.5 h-3.5", candidate.starred && "fill-amber-400")} />
            </button>
          </div>
          <div className="text-[11px] text-ink-500 truncate">{candidate.headline}</div>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1">
        {candidate.skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-royal-50 text-royal-700"
          >
            {s}
          </span>
        ))}
        <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
          %{candidate.matchScore}
        </span>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-ink-100 flex items-center gap-1.5">
        <select
          value={candidate.stage}
          onChange={(e) => onChangeStage(e.target.value as PipelineStage)}
          className="text-[11px] py-1 px-2 rounded-md border border-ink-200 bg-white focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none flex-1"
        >
          {(["new", "screening", "interview", "offer", "hired", "rejected"] as PipelineStage[]).map(
            (s) => (
              <option key={s} value={s}>
                {stageLabels[s]}
              </option>
            )
          )}
        </select>
        <button
          onClick={() => toast.info(`${candidate.name.split(" ")[0]} ile mesajlaşma açıldı`)}
          className="p-1.5 rounded-md text-electric-700 bg-electric-50 hover:bg-electric-100"
          aria-label="Mesaj gönder"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => toast.info("Mülakat planlandı")}
          className="p-1.5 rounded-md text-royal-700 bg-royal-50 hover:bg-royal-100"
          aria-label="Mülakat planla"
        >
          <CalendarRange className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onReject}
          className="p-1.5 rounded-md text-ink-500 hover:text-rose-600 hover:bg-rose-50"
          aria-label="Reddet"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
