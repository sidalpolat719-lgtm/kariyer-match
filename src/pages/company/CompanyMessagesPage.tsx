import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  CalendarRange,
  CheckCircle2,
  FileText,
  Filter,
  Inbox,
  Mail,
  MapPin,
  Paperclip,
  Search,
  Send,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { stageLabels } from "../../data/companySeed";
import { cn } from "../../lib/cn";

const recruiterTemplates = [
  {
    id: "screen-call",
    label: "Ön görüşme öner",
    icon: <CalendarRange className="w-3.5 h-3.5" />,
    text: "Merhaba, profilinizi inceledik ve sizinle 30 dakikalık bir ön görüşme yapmak isteriz. Bu hafta içinde uygun olduğunuz zamanları paylaşır mısınız?",
  },
  {
    id: "request-portfolio",
    label: "Portfolyo iste",
    icon: <FileText className="w-3.5 h-3.5" />,
    text: "Merhaba, başvurunuz için teşekkürler. Daha önce çalıştığınız 1-2 projenin portfolyo bağlantısını paylaşır mısınız?",
  },
  {
    id: "tech-interview",
    label: "Teknik mülakat",
    icon: <UserCheck className="w-3.5 h-3.5" />,
    text: "Süreciniz olumlu ilerliyor. Bir sonraki adım olarak 45 dakikalık bir teknik mülakat planlamak istiyoruz.",
  },
  {
    id: "offer",
    label: "Teklif gönder",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    text: "Sizinle çalışmaktan heyecan duyarız. Detaylı iş teklifimizi e-posta ile ilettik, sorularınız için her zaman buradayız.",
  },
];

const filters = [
  { id: "all", label: "Tüm Adaylar" },
  { id: "starred", label: "Yıldızlı" },
  { id: "unread", label: "Okunmamış" },
  { id: "interview", label: "Mülakat" },
  { id: "offer", label: "Teklif" },
];

export default function CompanyMessagesPage() {
  const { conversations, talent, sendMessage, markConversationRead, toggleStarConversation } =
    useCompanyData();
  const toast = useToast();
  const [activeId, setActiveId] = useState(conversations[0]?.id || "");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showOnMobile, setShowOnMobile] = useState<"list" | "chat" | "info">("list");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);
  const candidate = useMemo(
    () => (active ? talent.find((t) => t.id === active.candidateId) : undefined),
    [active, talent]
  );

  const filtered = conversations.filter((c) => {
    const matchSearch =
      !search ||
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.candidateHeadline.toLowerCase().includes(search.toLowerCase());
    if (filter === "starred") return matchSearch && c.starred;
    if (filter === "unread") return matchSearch && c.unread > 0;
    if (filter === "interview") return matchSearch && c.stage === "interview";
    if (filter === "offer") return matchSearch && c.stage === "offer";
    return matchSearch;
  });

  useEffect(() => {
    if (active && active.unread > 0) markConversationRead(active.id);
  }, [active, markConversationRead]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, activeId]);

  const handleSend = (msg?: string) => {
    if (!active) return;
    const value = (msg ?? text).trim();
    if (!value) return;
    sendMessage(active.id, value);
    setText("");
  };

  return (
    <div className="-mt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl bg-white border border-ink-100 shadow-soft overflow-hidden h-[calc(100dvh-9rem)] lg:h-[calc(100dvh-8rem)]">
        {/* Conversation list */}
        <aside
          className={cn(
            "lg:col-span-4 xl:col-span-3 border-r border-ink-100 flex flex-col",
            showOnMobile === "list" ? "flex" : "hidden lg:flex"
          )}
        >
          <div className="p-4 border-b border-ink-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-midnight-950 inline-flex items-center gap-2">
                <Inbox className="w-4 h-4 text-royal-700" /> Aday Inbox
              </h2>
              <span className="text-[10px] font-bold text-royal-700 bg-royal-50 px-2 py-0.5 rounded-md">
                {conversations.reduce((s, c) => s + c.unread, 0)} yeni
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Aday ara..."
                className="input pl-9 py-2 text-sm"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "text-[11px] font-semibold px-2 py-1 rounded-md transition",
                    filter === f.id
                      ? "bg-royal-500 text-white"
                      : "bg-ink-100 text-ink-700 hover:bg-ink-200"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setActiveId(c.id);
                    setShowOnMobile("chat");
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 flex items-start gap-3 border-b border-ink-50 transition",
                    activeId === c.id ? "bg-royal-50/60" : "hover:bg-ink-50"
                  )}
                >
                  <Avatar name={c.candidateName} color={c.candidateColor} online={c.online} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-sm font-bold text-midnight-950 truncate">
                          {c.candidateName}
                        </span>
                        {c.starred && (
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-ink-500 shrink-0">{c.lastTime}</span>
                    </div>
                    <div className="text-[11px] text-ink-500 truncate">{c.candidateHeadline}</div>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <span className="text-xs text-ink-700 truncate">{c.lastMessage}</span>
                      {c.unread > 0 && (
                        <span className="text-[10px] font-bold bg-royal-500 text-white rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    {c.postingTitle && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-royal-700 bg-royal-50 px-1.5 py-0.5 rounded">
                        <Briefcase className="w-2.5 h-2.5" /> {c.postingTitle}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat */}
        <section
          className={cn(
            "lg:col-span-5 xl:col-span-6 flex flex-col border-r border-ink-100",
            showOnMobile === "chat" ? "flex" : "hidden lg:flex"
          )}
        >
          {!active ? (
            <div className="flex-1 flex flex-col items-center justify-center text-ink-500 p-10 text-center">
              <Inbox className="w-10 h-10 text-ink-300" />
              <p className="mt-3 text-sm">Bir konuşma seç.</p>
            </div>
          ) : (
            <>
              <div className="px-4 sm:px-6 py-3 border-b border-ink-100 flex items-center gap-3">
                <button
                  onClick={() => setShowOnMobile("list")}
                  className="lg:hidden p-2 rounded-lg hover:bg-ink-100 text-ink-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Avatar name={active.candidateName} color={active.candidateColor} online={active.online} />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-midnight-950 truncate">{active.candidateName}</div>
                  <div className="text-xs text-ink-500 truncate">{active.candidateHeadline}</div>
                </div>
                <button
                  onClick={() => {
                    toggleStarConversation(active.id);
                    toast.success(active.starred ? "Yıldız kaldırıldı" : "Yıldıza eklendi");
                  }}
                  className={cn(
                    "p-2 rounded-lg",
                    active.starred ? "text-amber-500" : "text-ink-400 hover:text-amber-500"
                  )}
                  aria-label="Yıldızla"
                >
                  <Star className={cn("w-4 h-4", active.starred && "fill-amber-400")} />
                </button>
                <button
                  onClick={() => setShowOnMobile("info")}
                  className="lg:hidden p-2 rounded-lg hover:bg-ink-100 text-ink-700"
                  aria-label="Aday detayı"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-grad-corp-soft"
              >
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-end gap-2",
                      m.from === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    {m.from === "them" && (
                      <Avatar name={active.candidateName} color={active.candidateColor} size="xs" />
                    )}
                    <div
                      className={cn(
                        "max-w-[78%] px-4 py-2.5 rounded-2xl text-sm shadow-soft",
                        m.from === "me"
                          ? "rounded-br-md text-white"
                          : "bg-white text-ink-900 rounded-bl-md border border-ink-100"
                      )}
                      style={
                        m.from === "me"
                          ? { background: "linear-gradient(135deg,#8b5cf6 0%, #d946ef 100%)" }
                          : undefined
                      }
                    >
                      <div>{m.text}</div>
                      <div
                        className={cn(
                          "text-[10px] mt-1 text-right",
                          m.from === "me" ? "text-white/70" : "text-ink-400"
                        )}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Templates */}
              <div className="px-4 sm:px-6 pt-3 flex flex-wrap gap-1.5 border-t border-ink-100">
                {recruiterTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      handleSend(t.text);
                      toast.success(`${t.label} şablonu gönderildi`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-royal-50 text-royal-700 hover:bg-royal-100"
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6 border-t border-ink-100">
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => toast.info("Dosya ekleme demo modunda inaktif")}
                    className="p-2.5 rounded-xl text-ink-500 hover:bg-ink-100"
                    aria-label="Dosya ekle"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Adaya mesaj yaz... (Enter ile gönder, Shift+Enter ile yeni satır)"
                    className="input resize-none max-h-32 py-2.5"
                  />
                  <button
                    onClick={() => handleSend()}
                    className="px-4 py-2.5 rounded-xl text-white font-semibold inline-flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#d946ef)" }}
                    aria-label="Gönder"
                  >
                    <Send className="w-4 h-4" />
                    Gönder
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Candidate info panel */}
        <aside
          className={cn(
            "xl:col-span-3 lg:col-span-3 flex-col bg-ink-50/30",
            showOnMobile === "info" ? "flex" : "hidden xl:flex"
          )}
        >
          {showOnMobile === "info" && (
            <button
              onClick={() => setShowOnMobile("chat")}
              className="lg:hidden p-3 text-sm font-semibold text-ink-700 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Geri
            </button>
          )}
          {candidate && active && (
            <div className="p-5 overflow-y-auto">
              <div className="flex flex-col items-center text-center">
                <Avatar name={candidate.name} color={candidate.avatarColor} size="xl" />
                <div className="font-bold text-midnight-950 mt-3">{candidate.name}</div>
                <div className="text-xs text-ink-500">{candidate.headline}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                  <Sparkles className="w-3 h-3" /> %{candidate.matchScore} eşleşme
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <Row icon={<Briefcase className="w-4 h-4" />} label="Pozisyon">
                  {active.postingTitle}
                </Row>
                <Row icon={<UserCheck className="w-4 h-4" />} label="Pipeline Aşaması">
                  <span className="text-royal-700 font-semibold">{stageLabels[candidate.stage]}</span>
                </Row>
                <Row icon={<MapPin className="w-4 h-4" />} label="Şehir">
                  {candidate.city}
                </Row>
                <Row icon={<Mail className="w-4 h-4" />} label="E-posta">
                  <span className="truncate">{candidate.email}</span>
                </Row>
              </div>

              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-2 inline-flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Yetenekler
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-royal-50 text-royal-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <Button
                  fullWidth
                  size="sm"
                  onClick={() => toast.success("Mülakat planlama açıldı")}
                  className="!bg-grad-corp-cta"
                  iconLeft={<CalendarRange className="w-4 h-4" />}
                >
                  Mülakat Planla
                </Button>
                <Button
                  fullWidth
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Aday profili açıldı")}
                >
                  Tam Profili Gör
                </Button>
              </div>

              {candidate.notes && (
                <div className="mt-5 rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-amber-700 mb-1">
                    Recruiter Notu
                  </div>
                  <p className="text-xs text-ink-700">{candidate.notes}</p>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-white border border-ink-100 text-ink-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
        <div className="text-sm font-semibold text-midnight-950 truncate">{children}</div>
      </div>
    </div>
  );
}
