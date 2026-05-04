import { useMemo, useState } from "react";
import { Calendar, Eye, ListChecks, MoveRight, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Tabs } from "../components/ui/Tabs";
import { useAppData } from "../context/AppDataContext";
import type { Application, ApplicationStatus } from "../types";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";
import { cn } from "../lib/cn";
import { EmptyState } from "../components/ui/EmptyState";

const columns: { id: ApplicationStatus; label: string; color: string; description: string }[] = [
  { id: "saved", label: "Kayıtlı", color: "bg-ink-300", description: "İncelemek istediklerin" },
  { id: "applied", label: "Başvurdum", color: "bg-electric-500", description: "Aktif başvurular" },
  { id: "reviewed", label: "İnceleniyor", color: "bg-royal-500", description: "Recruiter incelemede" },
  { id: "interview", label: "Mülakat", color: "bg-amber-500", description: "Görüşme planlandı" },
  { id: "offer", label: "Teklif", color: "bg-emerald-500", description: "İş teklifi geldi" },
  { id: "rejected", label: "Reddedildi", color: "bg-rose-400", description: "Pozisyon kapandı" },
];

export default function ApplicationsPage() {
  const { applications, internships, saved, withdraw, setApplicationStatus } = useAppData();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const toast = useToast();

  // Build a unified list (saved + applied)
  const items = useMemo(() => {
    const fromSaved: Application[] = saved
      .filter((sid) => !applications.some((a) => a.internshipId === sid))
      .map((sid) => ({
        id: "s-" + sid,
        internshipId: sid,
        status: "saved",
        appliedAt: "—",
      }));
    return [...fromSaved, ...applications];
  }, [saved, applications]);

  const grouped = useMemo(() => {
    const map: Record<ApplicationStatus, Application[]> = {
      saved: [],
      applied: [],
      reviewed: [],
      interview: [],
      offer: [],
      rejected: [],
    };
    items.forEach((it) => {
      map[it.status].push(it);
    });
    return map;
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-display text-2xl sm:text-3xl">Başvurularım</h1>
          <p className="text-ink-600 mt-1 text-sm">
            Tüm başvurularını Kanban panosunda yönet, sonraki adımları kaçırma.
          </p>
        </div>
        <Tabs
          tabs={[
            { id: "kanban", label: "Kanban" },
            { id: "list", label: "Liste" },
          ]}
          active={view}
          onChange={(v) => setView(v as "kanban" | "list")}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {columns.map((c) => (
          <Card key={c.id} className="!p-4 text-center">
            <div className={`w-2.5 h-2.5 rounded-full ${c.color} mx-auto`} />
            <div className="text-2xl font-extrabold text-midnight-950 mt-2">
              {grouped[c.id].length}
            </div>
            <div className="text-[11px] text-ink-500 uppercase tracking-wider">{c.label}</div>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState
          icon={<ListChecks className="w-6 h-6" />}
          title="Henüz başvurun yok"
          description="Eşleşmeler sayfasında ilgini çeken stajları kaydet ve başvurmaya başla."
          action={
            <Link to="/app/matches">
              <Button>Eşleşmelere Göz At</Button>
            </Link>
          }
        />
      )}

      {/* Kanban */}
      {view === "kanban" && items.length > 0 && (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-flow-col auto-cols-[260px] sm:auto-cols-[280px] lg:auto-cols-fr gap-4 min-w-full">
            {columns.map((col) => (
              <div key={col.id} className="rounded-2xl bg-ink-50/60 border border-ink-100 p-3 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`} />
                    <span className="text-sm font-bold text-midnight-950">{col.label}</span>
                    <span className="text-xs font-bold text-ink-500 bg-white px-1.5 py-0.5 rounded-md border border-ink-100">
                      {grouped[col.id].length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 flex-1 min-h-[120px]">
                  {grouped[col.id].length === 0 && (
                    <div className="text-xs text-ink-400 italic px-1">{col.description}</div>
                  )}
                  {grouped[col.id].map((a) => {
                    const ip = internships.find((i) => i.id === a.internshipId);
                    if (!ip) return null;
                    return (
                      <div
                        key={a.id}
                        className="rounded-xl bg-white border border-ink-100 p-3 hover:shadow-card transition"
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-9 h-9 rounded-lg text-white text-xs font-bold flex items-center justify-center"
                            style={{ background: ip.logoColor }}
                          >
                            {ip.companyShort}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/internships/${ip.id}`}
                              className="text-sm font-bold text-midnight-950 hover:text-electric-700 truncate block"
                            >
                              {ip.title}
                            </Link>
                            <div className="text-[11px] text-ink-500 truncate">
                              {ip.company} · {ip.location}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-ink-500 inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {a.appliedAt}
                          </span>
                          <span className="font-bold text-emerald-700">%{ip.matchScore}</span>
                        </div>
                        {a.nextAction && col.id !== "saved" && (
                          <div className="mt-2 text-[11px] text-electric-700 bg-electric-50 px-2 py-1 rounded-md">
                            {a.nextAction}
                          </div>
                        )}
                        {/* Status mover */}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <select
                            value={a.status}
                            onChange={(e) => {
                              setApplicationStatus(a.id, e.target.value as ApplicationStatus);
                              toast.success("Durum güncellendi");
                            }}
                            className="text-[11px] py-1 px-2 rounded-md border border-ink-200 bg-white focus:border-electric-400 focus:ring-2 focus:ring-electric-100 outline-none"
                          >
                            {columns.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              withdraw(a.id);
                              toast.info("Başvuru kaldırıldı");
                            }}
                            className="text-ink-400 hover:text-rose-600 p-1"
                            aria-label="Kaldır"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List view */}
      {view === "list" && items.length > 0 && (
        <Card padded={false}>
          <div className="grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wider text-ink-500 font-bold border-b border-ink-100 bg-ink-50/50">
            <div className="col-span-5">Pozisyon</div>
            <div className="col-span-2">Tarih</div>
            <div className="col-span-2">Durum</div>
            <div className="col-span-2">Sonraki Aksiyon</div>
            <div className="col-span-1 text-right">İşlem</div>
          </div>
          <ul>
            {items.map((a) => {
              const ip = internships.find((i) => i.id === a.internshipId);
              if (!ip) return null;
              const col = columns.find((c) => c.id === a.status)!;
              return (
                <ListRow key={a.id}>
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center"
                      style={{ background: ip.logoColor }}
                    >
                      {ip.companyShort}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/internships/${ip.id}`}
                        className="text-sm font-bold text-midnight-950 hover:text-electric-700 truncate block"
                      >
                        {ip.title}
                      </Link>
                      <div className="text-xs text-ink-500 truncate">
                        {ip.company} · %{ip.matchScore} eşleşme
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-2 text-sm text-ink-700">{a.appliedAt}</div>
                  <div className="col-span-6 sm:col-span-2">
                    <Badge tone={statusTone(col.id)}>{col.label}</Badge>
                  </div>
                  <div className="col-span-9 sm:col-span-2 text-xs text-ink-700">
                    {a.nextAction || "—"}
                  </div>
                  <div className="col-span-3 sm:col-span-1 flex items-center gap-1 justify-end">
                    <Link to={`/internships/${ip.id}`} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        const order: ApplicationStatus[] = ["saved", "applied", "reviewed", "interview", "offer"];
                        const next = order[order.indexOf(a.status) + 1];
                        if (next) {
                          setApplicationStatus(a.id, next);
                          toast.success("Sonraki aşamaya alındı");
                        }
                      }}
                      className="p-1.5 rounded-lg text-electric-700 hover:bg-electric-50"
                      aria-label="Sonraki adım"
                    >
                      <MoveRight className="w-4 h-4" />
                    </button>
                  </div>
                </ListRow>
              );
            })}
          </ul>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <SectionTitle title="Sonraki Aksiyon Önerileri" />
        <ul className="grid sm:grid-cols-3 gap-3">
          {[
            { t: "Mülakat hazırlığını tamamla", d: "Sistem tasarımı sorularına 1 saat ayır.", c: "amber" as const },
            { t: "Recruiter'a teşekkür mesajı", d: "Atlas Analytics ile son görüşmenden sonra.", c: "primary" as const },
            { t: "Yeni eşleşmeleri kaydet", d: "Bu hafta 12 yeni fırsat eklendi.", c: "emerald" as const },
          ].map((tip, i) => (
            <li
              key={i}
              className={cn(
                "rounded-xl p-4 border",
                tip.c === "amber" && "bg-amber-50 border-amber-100",
                tip.c === "primary" && "bg-electric-50 border-electric-100",
                tip.c === "emerald" && "bg-emerald-50 border-emerald-100"
              )}
            >
              <div className="font-bold text-midnight-950 text-sm">{tip.t}</div>
              <p className="text-xs text-ink-700 mt-1">{tip.d}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ListRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-12 gap-y-2 sm:gap-y-0 px-5 py-3 border-b last:border-b-0 border-ink-100 hover:bg-ink-50/40 transition items-center">
      {children}
    </li>
  );
}

function statusTone(s: ApplicationStatus): "neutral" | "primary" | "purple" | "amber" | "emerald" | "rose" {
  switch (s) {
    case "applied":
      return "primary";
    case "reviewed":
      return "purple";
    case "interview":
      return "amber";
    case "offer":
      return "emerald";
    case "rejected":
      return "rose";
    default:
      return "neutral";
  }
}
