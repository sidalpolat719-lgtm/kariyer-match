import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, storage } from "../lib/storage";
import {
  seedCompanyAnalytics,
  seedCompanyConversations,
  seedCompanyProfile,
  seedInterviews,
  seedInvoices,
  seedPostings,
  seedTalent,
  seedTeam,
} from "../data/companySeed";
import type {
  CompanyConversation,
  CompanyInterview,
  CompanyPosting,
  CompanyProfile,
  InvoiceRow,
  PipelineStage,
  PostingStatus,
  TalentCandidate,
  TeamMember,
} from "../types/company";

interface CompanyCtx {
  postings: CompanyPosting[];
  talent: TalentCandidate[];
  interviews: CompanyInterview[];
  team: TeamMember[];
  conversations: CompanyConversation[];
  profile: CompanyProfile;
  invoices: InvoiceRow[];
  analytics: typeof seedCompanyAnalytics;

  // posting actions
  createPosting: (p: Omit<CompanyPosting, "id" | "applicants" | "views" | "matches" | "interviewed" | "hires" | "postedAt">) => void;
  updatePosting: (id: string, patch: Partial<CompanyPosting>) => void;
  removePosting: (id: string) => void;
  setPostingStatus: (id: string, status: PostingStatus) => void;
  duplicatePosting: (id: string) => void;

  // talent actions
  toggleStarCandidate: (id: string) => void;
  setCandidateStage: (id: string, stage: PipelineStage) => void;
  rejectCandidate: (id: string) => void;
  inviteCandidate: (data: { name: string; email: string; postingTitle: string }) => void;
  addNoteToCandidate: (id: string, note: string) => void;

  // interview actions
  scheduleInterview: (interview: Omit<CompanyInterview, "id" | "status">) => void;
  cancelInterview: (id: string) => void;
  completeInterview: (id: string) => void;

  // team actions
  inviteTeamMember: (data: { name: string; email: string; role: TeamMember["role"]; department: string }) => void;
  removeTeamMember: (id: string) => void;
  changeTeamRole: (id: string, role: TeamMember["role"]) => void;

  // messaging
  sendMessage: (conversationId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  toggleStarConversation: (conversationId: string) => void;

  // profile
  updateProfile: (patch: Partial<CompanyProfile>) => void;
}

const CompanyContext = createContext<CompanyCtx | null>(null);

export function CompanyDataProvider({ children }: { children: ReactNode }) {
  const [postings, setPostings] = useState<CompanyPosting[]>(() =>
    storage.get(STORAGE_KEYS.cPostings, seedPostings)
  );
  const [talent, setTalent] = useState<TalentCandidate[]>(() =>
    storage.get(STORAGE_KEYS.cTalent, seedTalent)
  );
  const [interviews, setInterviews] = useState<CompanyInterview[]>(() =>
    storage.get(STORAGE_KEYS.cInterviews, seedInterviews)
  );
  const [team, setTeam] = useState<TeamMember[]>(() =>
    storage.get(STORAGE_KEYS.cTeam, seedTeam)
  );
  const [conversations, setConversations] = useState<CompanyConversation[]>(() =>
    storage.get(STORAGE_KEYS.cConversations, seedCompanyConversations)
  );
  const [profile, setProfile] = useState<CompanyProfile>(() =>
    storage.get(STORAGE_KEYS.cProfile, seedCompanyProfile)
  );
  const [invoices] = useState<InvoiceRow[]>(() =>
    storage.get(STORAGE_KEYS.cInvoices, seedInvoices)
  );

  useEffect(() => storage.set(STORAGE_KEYS.cPostings, postings), [postings]);
  useEffect(() => storage.set(STORAGE_KEYS.cTalent, talent), [talent]);
  useEffect(() => storage.set(STORAGE_KEYS.cInterviews, interviews), [interviews]);
  useEffect(() => storage.set(STORAGE_KEYS.cTeam, team), [team]);
  useEffect(() => storage.set(STORAGE_KEYS.cConversations, conversations), [conversations]);
  useEffect(() => storage.set(STORAGE_KEYS.cProfile, profile), [profile]);

  // ---------- POSTINGS ----------
  const createPosting = useCallback<CompanyCtx["createPosting"]>((p) => {
    const today = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const newPosting: CompanyPosting = {
      id: "p-" + Math.random().toString(36).slice(2, 7),
      applicants: 0,
      views: 0,
      matches: 0,
      interviewed: 0,
      hires: 0,
      postedAt: p.status === "draft" ? "—" : today,
      ...p,
    };
    setPostings((prev) => [newPosting, ...prev]);
  }, []);

  const updatePosting = useCallback((id: string, patch: Partial<CompanyPosting>) => {
    setPostings((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removePosting = useCallback((id: string) => {
    setPostings((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setPostingStatus = useCallback((id: string, status: PostingStatus) => {
    setPostings((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const today = new Date().toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        return {
          ...p,
          status,
          postedAt: status === "active" && p.postedAt === "—" ? today : p.postedAt,
        };
      })
    );
  }, []);

  const duplicatePosting = useCallback((id: string) => {
    setPostings((prev) => {
      const original = prev.find((p) => p.id === id);
      if (!original) return prev;
      const clone: CompanyPosting = {
        ...original,
        id: "p-" + Math.random().toString(36).slice(2, 7),
        title: original.title + " (Kopya)",
        status: "draft",
        applicants: 0,
        views: 0,
        matches: 0,
        interviewed: 0,
        hires: 0,
        postedAt: "—",
      };
      return [clone, ...prev];
    });
  }, []);

  // ---------- TALENT ----------
  const toggleStarCandidate = useCallback((id: string) => {
    setTalent((prev) => prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)));
  }, []);

  const setCandidateStage = useCallback((id: string, stage: PipelineStage) => {
    setTalent((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              stage,
              lastActivity: "şimdi",
            }
          : c
      )
    );
  }, []);

  const rejectCandidate = useCallback((id: string) => {
    setTalent((prev) => prev.map((c) => (c.id === id ? { ...c, stage: "rejected" } : c)));
  }, []);

  const inviteCandidate = useCallback<CompanyCtx["inviteCandidate"]>((data) => {
    const colors = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
    const newCand: TalentCandidate = {
      id: "t-" + Math.random().toString(36).slice(2, 7),
      name: data.name,
      headline: "Davetli Aday",
      university: "—",
      program: "—",
      city: "—",
      experienceYears: 0,
      matchScore: 70,
      skills: [],
      availability: "—",
      workType: "Hibrit",
      stage: "new",
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      starred: false,
      email: data.email,
      lastActivity: "şimdi",
      source: "Davet",
      notes: "Pozisyon: " + data.postingTitle,
    };
    setTalent((prev) => [newCand, ...prev]);
  }, []);

  const addNoteToCandidate = useCallback((id: string, note: string) => {
    setTalent((prev) => prev.map((c) => (c.id === id ? { ...c, notes: note } : c)));
  }, []);

  // ---------- INTERVIEWS ----------
  const scheduleInterview = useCallback<CompanyCtx["scheduleInterview"]>((interview) => {
    setInterviews((prev) => [
      { ...interview, id: "i-" + Math.random().toString(36).slice(2, 7), status: "scheduled" },
      ...prev,
    ]);
  }, []);

  const cancelInterview = useCallback((id: string) => {
    setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status: "cancelled" } : i)));
  }, []);

  const completeInterview = useCallback((id: string) => {
    setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status: "completed" } : i)));
  }, []);

  // ---------- TEAM ----------
  const inviteTeamMember = useCallback<CompanyCtx["inviteTeamMember"]>((data) => {
    const colors = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
    setTeam((prev) => [
      ...prev,
      {
        id: "tm-" + Math.random().toString(36).slice(2, 7),
        ...data,
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        status: "invited",
        lastActive: "—",
        hires: 0,
      },
    ]);
  }, []);

  const removeTeamMember = useCallback((id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const changeTeamRole = useCallback((id: string, role: TeamMember["role"]) => {
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }, []);

  // ---------- MESSAGING ----------
  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const id = "m-" + Math.random().toString(36).slice(2, 7);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, { id, from: "me", text, time }],
              lastMessage: text,
              lastTime: "şimdi",
              unread: 0,
            }
          : c
      )
    );
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: "m-" + Math.random().toString(36).slice(2, 7),
                    from: "them",
                    text: "Hızlı dönüş için teşekkürler, en kısa sürede inceleyip yanıtlayacağım.",
                    time: new Date().toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ],
                lastMessage: "Hızlı dönüş için teşekkürler...",
                lastTime: "şimdi",
              }
            : c
        )
      );
    }, 1300);
  }, []);

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)));
  }, []);

  const toggleStarConversation = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, starred: !c.starred } : c))
    );
  }, []);

  // ---------- PROFILE ----------
  const updateProfile = useCallback((patch: Partial<CompanyProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<CompanyCtx>(
    () => ({
      postings,
      talent,
      interviews,
      team,
      conversations,
      profile,
      invoices,
      analytics: seedCompanyAnalytics,
      createPosting,
      updatePosting,
      removePosting,
      setPostingStatus,
      duplicatePosting,
      toggleStarCandidate,
      setCandidateStage,
      rejectCandidate,
      inviteCandidate,
      addNoteToCandidate,
      scheduleInterview,
      cancelInterview,
      completeInterview,
      inviteTeamMember,
      removeTeamMember,
      changeTeamRole,
      sendMessage,
      markConversationRead,
      toggleStarConversation,
      updateProfile,
    }),
    [
      postings,
      talent,
      interviews,
      team,
      conversations,
      profile,
      invoices,
      createPosting,
      updatePosting,
      removePosting,
      setPostingStatus,
      duplicatePosting,
      toggleStarCandidate,
      setCandidateStage,
      rejectCandidate,
      inviteCandidate,
      addNoteToCandidate,
      scheduleInterview,
      cancelInterview,
      completeInterview,
      inviteTeamMember,
      removeTeamMember,
      changeTeamRole,
      sendMessage,
      markConversationRead,
      toggleStarConversation,
      updateProfile,
    ]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompanyData() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompanyData must be used within CompanyDataProvider");
  return ctx;
}
