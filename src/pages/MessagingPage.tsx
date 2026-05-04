import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageCircle,
  Paperclip,
  Send,
  Search,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { useAppData } from "../context/AppDataContext";
import { cn } from "../lib/cn";
import { useToast } from "../context/ToastContext";

const quickActions = [
  { id: "portfolio", label: "Portfolyo Gönder", icon: <FileText className="w-3.5 h-3.5" />, message: "Portfolyomu burada bulabilirsin: ada.dev/portfolio" },
  { id: "interview", label: "Mülakat Planla", icon: <Calendar className="w-3.5 h-3.5" />, message: "Yarın 15:00'te 30 dakikalık bir görüşme yapabilir miyiz?" },
  { id: "feedback", label: "Geri Bildirim İste", icon: <ThumbsUp className="w-3.5 h-3.5" />, message: "Süreç hakkında geri bildiriminizi alabilir miyim?" },
  { id: "share", label: "Fırsat Paylaş", icon: <Sparkles className="w-3.5 h-3.5" />, message: "Bu fırsata göz atmak isteyebilirsin: pathmatch.com/internships/ip-1" },
];

export default function MessagingPage() {
  const { conversations, sendMessage } = useAppData();
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id || "");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [showOnMobile, setShowOnMobile] = useState<"list" | "chat">("list");
  const scrollRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);

  const filtered = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-4 rounded-3xl bg-white border border-ink-100 shadow-soft overflow-hidden h-[calc(100dvh-9rem)] lg:h-[calc(100dvh-8rem)]">
        {/* Conversation list */}
        <aside
          className={cn(
            "lg:col-span-4 xl:col-span-3 border-r border-ink-100 flex flex-col",
            showOnMobile === "list" ? "flex" : "hidden lg:flex"
          )}
        >
          <div className="p-4 border-b border-ink-100">
            <h2 className="font-bold text-midnight-950">Mesajlar</h2>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sohbet ara..."
                className="input pl-9 py-2 text-sm"
              />
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
                    activeId === c.id ? "bg-electric-50/60" : "hover:bg-ink-50"
                  )}
                >
                  <Avatar name={c.name} color={c.avatarColor} online={c.online} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-midnight-950 truncate">{c.name}</span>
                      <span className="text-[10px] text-ink-500 shrink-0">{c.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-ink-600 truncate">{c.lastMessage}</span>
                      {c.unread > 0 && (
                        <span className="ml-auto text-[10px] font-bold bg-electric-500 text-white rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <Badge
                        size="sm"
                        tone={c.role === "Mentor" ? "purple" : c.role === "Recruiter" ? "primary" : "neutral"}
                      >
                        {c.role}
                      </Badge>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat panel */}
        <section
          className={cn(
            "lg:col-span-8 xl:col-span-9 flex flex-col",
            showOnMobile === "chat" ? "flex" : "hidden lg:flex"
          )}
        >
          {!active ? (
            <div className="flex-1 flex flex-col items-center justify-center text-ink-500 p-10 text-center">
              <MessageCircle className="w-10 h-10 text-ink-300" />
              <p className="mt-3 text-sm">Bir sohbet seçin.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 sm:px-6 py-3 border-b border-ink-100 flex items-center gap-3">
                <button
                  onClick={() => setShowOnMobile("list")}
                  className="lg:hidden p-2 rounded-lg hover:bg-ink-100 text-ink-700"
                  aria-label="Geri"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Avatar name={active.name} color={active.avatarColor} online={active.online} />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-midnight-950 truncate">{active.name}</div>
                  <div className="text-xs text-ink-500 truncate">
                    {active.company} · {active.online ? "Çevrimiçi" : "Çevrimdışı"}
                  </div>
                </div>
                <Badge tone={active.role === "Mentor" ? "purple" : "primary"}>{active.role}</Badge>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-grad-soft">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-end gap-2",
                      m.from === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    {m.from === "them" && <Avatar name={active.name} color={active.avatarColor} size="xs" />}
                    <div
                      className={cn(
                        "max-w-[78%] px-4 py-2.5 rounded-2xl text-sm shadow-soft",
                        m.from === "me"
                          ? "bg-grad-cta text-white rounded-br-md"
                          : "bg-white text-ink-900 rounded-bl-md border border-ink-100"
                      )}
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

              {/* Quick actions */}
              <div className="px-4 sm:px-6 pt-3 flex flex-wrap gap-1.5 border-t border-ink-100">
                {quickActions.map((qa) => (
                  <button
                    key={qa.id}
                    onClick={() => {
                      handleSend(qa.message);
                      toast.success(`${qa.label} gönderildi`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-electric-50 text-electric-700 hover:bg-electric-100"
                  >
                    {qa.icon}
                    {qa.label}
                  </button>
                ))}
              </div>

              {/* Composer */}
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
                    placeholder="Bir mesaj yaz..."
                    className="input resize-none max-h-32 py-2.5"
                  />
                  <button
                    onClick={() => handleSend()}
                    className="btn-primary px-4 py-2.5"
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
      </div>
    </div>
  );
}
