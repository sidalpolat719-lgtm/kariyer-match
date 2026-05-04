import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  MapPin,
  Plus,
  Users,
  Video,
  X,
} from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";
import type { CompanyInterview } from "../../types/company";
import { cn } from "../../lib/cn";

const turkishMonths = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];
const turkishDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function CompanyInterviewsPage() {
  const { interviews, talent, postings, scheduleInterview, cancelInterview, completeInterview } =
    useCompanyData();
  const toast = useToast();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [openSchedule, setOpenSchedule] = useState(false);

  const interviewsByDate = useMemo(() => {
    const map: Record<string, CompanyInterview[]> = {};
    interviews.forEach((i) => {
      if (!map[i.date]) map[i.date] = [];
      map[i.date].push(i);
    });
    return map;
  }, [interviews]);

  const upcoming = interviews
    .filter((i) => i.status === "scheduled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const completed = interviews.filter((i) => i.status === "completed");
  const cancelled = interviews.filter((i) => i.status === "cancelled");

  // Calendar grid generation
  const grid = useMemo(() => {
    const year = month.getFullYear();
    const monthIdx = month.getMonth();
    const firstDay = new Date(year, monthIdx, 1);
    const lastDay = new Date(year, monthIdx + 1, 0);
    let startDow = firstDay.getDay() - 1; // Mon=0
    if (startDow < 0) startDow = 6;
    const daysInMonth = lastDay.getDate();
    const cells: { date: string; day: number; current: boolean }[] = [];
    // prev month padding
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, monthIdx, -i);
      cells.push({ date: iso(d), day: d.getDate(), current: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, monthIdx, d);
      cells.push({ date: iso(dt), day: d, current: true });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      cells.push({ date: iso(next), day: next.getDate(), current: false });
    }
    return cells;
  }, [month]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
            Mülakatlar
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            <strong>{upcoming.length}</strong> planlı · <strong>{completed.length}</strong>{" "}
            tamamlandı · <strong>{cancelled.length}</strong> iptal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            tabs={[
              { id: "calendar", label: "Takvim" },
              { id: "list", label: "Liste" },
            ]}
            active={view}
            onChange={(v) => setView(v as "calendar" | "list")}
          />
          <Button
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => setOpenSchedule(true)}
            className="!bg-grad-corp-cta"
          >
            Mülakat Planla
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {view === "calendar" ? (
            <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-soft">
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-bold text-midnight-950">
                    {turkishMonths[month.getMonth()]} {month.getFullYear()}
                  </div>
                  <div className="text-xs text-ink-500">
                    Haftaya {upcoming.length} mülakat planlı
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
                    }
                    className="p-2 rounded-lg text-ink-700 hover:bg-ink-100"
                    aria-label="Önceki ay"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMonth(new Date())}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg text-ink-700 hover:bg-ink-100"
                  >
                    Bugün
                  </button>
                  <button
                    onClick={() =>
                      setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
                    }
                    className="p-2 rounded-lg text-ink-700 hover:bg-ink-100"
                    aria-label="Sonraki ay"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-[10px] font-bold uppercase tracking-wider text-ink-500 mb-2">
                {turkishDays.map((d) => (
                  <div key={d} className="text-center py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {grid.map((cell, i) => {
                  const dayInterviews = interviewsByDate[cell.date] || [];
                  const isToday = cell.date === iso(new Date());
                  const isSelected = selectedDay === cell.date;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(cell.date)}
                      className={cn(
                        "relative aspect-square rounded-xl p-1.5 text-left transition border",
                        cell.current
                          ? "bg-white text-midnight-950 hover:border-royal-300"
                          : "bg-ink-50/40 text-ink-400 border-transparent",
                        isToday && "border-royal-500 ring-2 ring-royal-100",
                        isSelected && "bg-royal-50 border-royal-400"
                      )}
                    >
                      <div
                        className={cn(
                          "text-[11px] font-bold",
                          isToday && "text-royal-700"
                        )}
                      >
                        {cell.day}
                      </div>
                      {dayInterviews.length > 0 && (
                        <div className="mt-1 flex flex-col gap-0.5">
                          {dayInterviews.slice(0, 2).map((iv) => (
                            <div
                              key={iv.id}
                              className="text-[9px] font-semibold text-white px-1 py-0.5 rounded truncate"
                              style={{ background: iv.candidateColor }}
                            >
                              {iv.time} {iv.candidateName.split(" ")[0]}
                            </div>
                          ))}
                          {dayInterviews.length > 2 && (
                            <div className="text-[9px] text-ink-500">
                              +{dayInterviews.length - 2} daha
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedDay && interviewsByDate[selectedDay] && (
                <div className="mt-5 border-t border-ink-100 pt-4">
                  <div className="font-bold text-midnight-950 mb-3">
                    {selectedDay} · {interviewsByDate[selectedDay].length} mülakat
                  </div>
                  <ul className="space-y-2">
                    {interviewsByDate[selectedDay].map((iv) => (
                      <InterviewRow
                        key={iv.id}
                        iv={iv}
                        compact
                        onCancel={() => {
                          cancelInterview(iv.id);
                          toast.info("Mülakat iptal edildi");
                        }}
                        onComplete={() => {
                          completeInterview(iv.id);
                          toast.success("Mülakat tamamlandı olarak işaretlendi");
                        }}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-soft">
              <div className="font-bold text-midnight-950 mb-3">Tüm Mülakatlar</div>
              <ul className="divide-y divide-ink-100">
                {[...upcoming, ...completed, ...cancelled].map((iv) => (
                  <InterviewRow
                    key={iv.id}
                    iv={iv}
                    onCancel={() => {
                      cancelInterview(iv.id);
                      toast.info("Mülakat iptal edildi");
                    }}
                    onComplete={() => {
                      completeInterview(iv.id);
                      toast.success("Mülakat tamamlandı olarak işaretlendi");
                    }}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Side: Today + interviewers */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-ink-100 p-5 shadow-soft">
            <div className="font-bold text-midnight-950 mb-3">Yaklaşan</div>
            <ul className="space-y-3">
              {upcoming.slice(0, 5).map((iv) => (
                <li
                  key={iv.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-ink-100 hover:border-royal-200 hover:bg-royal-50/30 transition"
                >
                  <Avatar name={iv.candidateName} color={iv.candidateColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-midnight-950 truncate">
                      {iv.candidateName}
                    </div>
                    <div className="text-[11px] text-ink-500 truncate">{iv.postingTitle}</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-royal-700 bg-royal-50 px-1.5 py-0.5 rounded">
                      <Clock className="w-2.5 h-2.5" /> {iv.date} · {iv.time}
                    </div>
                  </div>
                </li>
              ))}
              {upcoming.length === 0 && (
                <p className="text-sm text-ink-500">Yaklaşan mülakat yok.</p>
              )}
            </ul>
          </div>

          <div
            className="rounded-3xl p-5 text-white relative overflow-hidden"
            style={{
              backgroundImage: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #d946ef 100%)",
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-200">
              Bu Hafta
            </div>
            <div className="text-3xl font-extrabold mt-2">{upcoming.length}</div>
            <p className="text-xs text-white/80 mt-1">Planlı mülakat</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg p-2 bg-white/10 backdrop-blur">
                <div className="text-[10px] text-white/70 uppercase tracking-wider">Online</div>
                <div className="text-base font-bold">
                  {interviews.filter((i) => i.mode === "Online" && i.status === "scheduled").length}
                </div>
              </div>
              <div className="rounded-lg p-2 bg-white/10 backdrop-blur">
                <div className="text-[10px] text-white/70 uppercase tracking-wider">Yüz Yüze</div>
                <div className="text-base font-bold">
                  {interviews.filter((i) => i.mode === "Yüz Yüze" && i.status === "scheduled").length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleInterviewModal
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        onSchedule={(data) => {
          scheduleInterview(data);
          toast.success("Mülakat planlandı");
          setOpenSchedule(false);
        }}
        candidates={talent}
        postings={postings}
      />
    </div>
  );
}

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function InterviewRow({
  iv,
  compact,
  onCancel,
  onComplete,
}: {
  iv: CompanyInterview;
  compact?: boolean;
  onCancel: () => void;
  onComplete: () => void;
}) {
  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-3",
        compact ? "p-3 rounded-xl border border-ink-100" : "py-3"
      )}
    >
      <Avatar name={iv.candidateName} color={iv.candidateColor} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-midnight-950">{iv.candidateName}</div>
        <div className="text-[11px] text-ink-500 truncate">{iv.postingTitle}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-600">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {iv.date} · {iv.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> {iv.duration} dk
          </span>
          <span className="inline-flex items-center gap-1">
            {iv.mode === "Online" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            {iv.mode}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="w-3 h-3" /> {iv.interviewers.join(", ")}
          </span>
        </div>
      </div>
      <span
        className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-md",
          iv.type === "Teknik Mülakat" && "bg-electric-50 text-electric-700",
          iv.type === "İlk Görüşme" && "bg-ink-100 text-ink-700",
          iv.type === "Vaka Çalışması" && "bg-amber-50 text-amber-700",
          iv.type === "Final Görüşme" && "bg-emerald-50 text-emerald-700"
        )}
      >
        {iv.type}
      </span>
      {iv.status === "scheduled" ? (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onComplete}
            iconLeft={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Tamamla
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            iconLeft={<X className="w-3.5 h-3.5" />}
            className="!text-rose-600"
          >
            İptal
          </Button>
        </div>
      ) : (
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-md",
            iv.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}
        >
          {iv.status === "completed" ? "Tamamlandı" : "İptal"}
        </span>
      )}
    </li>
  );
}

function ScheduleInterviewModal({
  open,
  onClose,
  onSchedule,
  candidates,
  postings,
}: {
  open: boolean;
  onClose: () => void;
  onSchedule: (data: Omit<CompanyInterview, "id" | "status">) => void;
  candidates: { id: string; name: string; avatarColor: string }[];
  postings: { id: string; title: string }[];
}) {
  const toast = useToast();
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || "");
  const [postingId, setPostingId] = useState(postings[0]?.id || "");
  const [date, setDate] = useState(iso(new Date()));
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState(45);
  const [type, setType] = useState<CompanyInterview["type"]>("İlk Görüşme");
  const [mode, setMode] = useState<CompanyInterview["mode"]>("Online");
  const [interviewers, setInterviewers] = useState("Recruiter");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mülakat Planla"
      description="Adayı, pozisyonu, tarih ve formatı seç."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Vazgeç
          </Button>
          <Button
            onClick={() => {
              if (!candidateId) {
                toast.error("Aday seç");
                return;
              }
              const candidate = candidates.find((c) => c.id === candidateId)!;
              const posting = postings.find((p) => p.id === postingId);
              onSchedule({
                candidateId,
                candidateName: candidate.name,
                candidateColor: candidate.avatarColor,
                postingTitle: posting?.title || "Genel Görüşme",
                date,
                time,
                duration,
                type,
                mode,
                interviewers: interviewers.split(",").map((s) => s.trim()).filter(Boolean),
              });
            }}
            className="!bg-grad-corp-cta"
          >
            Planla
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Aday</label>
            <select
              className="input mt-1.5"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Pozisyon</label>
            <select
              className="input mt-1.5"
              value={postingId}
              onChange={(e) => setPostingId(e.target.value)}
            >
              {postings.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Tarih</label>
            <input
              type="date"
              className="input mt-1.5"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Saat</label>
            <input
              type="time"
              className="input mt-1.5"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Süre (dk)</label>
            <input
              type="number"
              className="input mt-1.5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Mülakat Türü</label>
            <select
              className="input mt-1.5"
              value={type}
              onChange={(e) => setType(e.target.value as CompanyInterview["type"])}
            >
              <option>İlk Görüşme</option>
              <option>Teknik Mülakat</option>
              <option>Vaka Çalışması</option>
              <option>Final Görüşme</option>
            </select>
          </div>
          <div>
            <label className="label">Format</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["Online", "Yüz Yüze"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-semibold transition",
                    mode === m
                      ? "bg-royal-50 border-royal-400 text-royal-700"
                      : "border-ink-200 text-ink-700 hover:border-royal-300"
                  )}
                >
                  {m === "Online" ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="label">Mülakatçılar (virgülle)</label>
          <input
            className="input mt-1.5"
            value={interviewers}
            onChange={(e) => setInterviewers(e.target.value)}
            placeholder="Ayşe, Mehmet"
          />
        </div>
      </div>
    </Modal>
  );
}
