import { Bookmark, BookmarkCheck, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Internship } from "../../types";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { MatchScore } from "./MatchScore";
import { useAppData } from "../../context/AppDataContext";
import { useToast } from "../../context/ToastContext";

interface InternshipCardProps {
  internship: Internship;
  variant?: "compact" | "full";
}

export function InternshipCard({ internship, variant = "full" }: InternshipCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { saved, toggleSave, apply, applications } = useAppData();
  const toast = useToast();
  const isSaved = saved.includes(internship.id);
  const alreadyApplied = applications.some((a) => a.internshipId === internship.id);

  return (
    <article className="card p-5 card-hover group">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-soft shrink-0"
          style={{
            background: `linear-gradient(135deg, ${internship.logoColor} 0%, ${internship.logoColor}cc 100%)`,
          }}
          aria-hidden
        >
          {internship.companyShort}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/internships/${internship.id}`}
                className="text-base sm:text-lg font-bold text-midnight-950 hover:text-electric-700 transition-colors truncate block"
              >
                {internship.title}
              </Link>
              <div className="text-sm text-ink-600 mt-0.5">
                {internship.company} ·{" "}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 inline" />
                  {internship.location}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSave(internship.id);
                toast.success(isSaved ? "Kayıttan çıkarıldı" : "Fırsat kaydedildi");
              }}
              className="p-2 rounded-lg text-ink-400 hover:text-electric-600 hover:bg-electric-50 transition shrink-0"
              aria-label={isSaved ? "Kayıttan çıkar" : "Kaydet"}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-electric-600" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <Badge tone="primary">{internship.workType}</Badge>
            <Badge tone="purple">{internship.employmentType}</Badge>
            <Badge>{internship.industry}</Badge>
            {internship.duration && <Badge tone="emerald">{internship.duration}</Badge>}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {internship.skills.slice(0, variant === "compact" ? 3 : 6).map((s) => (
              <span
                key={s}
                className="text-[11px] font-medium px-2 py-1 rounded-md bg-ink-50 text-ink-700 border border-ink-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden sm:block">
          <MatchScore score={internship.matchScore} size="md" />
        </div>
      </div>

      {variant === "full" && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-ink-600">
              {internship.stipend && <span className="font-semibold text-midnight-950">{internship.stipend}</span>}
              {internship.stipend && <span className="mx-2 text-ink-300">·</span>}
              <span>İlan: {internship.postedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs font-semibold text-electric-700 hover:text-electric-800 inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Neden eşleştin?
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleSave(internship.id);
                  toast.info(isSaved ? "Kayıt kaldırıldı" : "Listene eklendi");
                }}
              >
                {isSaved ? "Kaydedildi" : "Kaydet"}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (alreadyApplied) {
                    toast.info("Bu fırsata zaten başvurdun");
                    return;
                  }
                  apply(internship.id);
                  toast.success("Başvurun gönderildi", `${internship.company} · ${internship.title}`);
                }}
              >
                {alreadyApplied ? "Başvuruldu" : "Hemen Başvur"}
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="mt-4 rounded-xl border border-electric-100 bg-electric-50/40 p-4 animate-fadeUp">
              <div className="text-xs font-bold text-electric-800 uppercase tracking-wider">
                Neden bu fırsat sana uygun?
              </div>
              <ul className="mt-2 space-y-1.5">
                {internship.matchReasons.map((r) => (
                  <li key={r} className="text-sm text-ink-700 flex gap-2">
                    <span className="text-electric-500 mt-0.5">●</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </article>
  );
}
