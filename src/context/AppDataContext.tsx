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
  seedConversations,
  seedInternships,
  seedNotifications,
  seedRoadmap,
} from "../data/seed";
import type {
  Application,
  ApplicationStatus,
  ChatMessage,
  Conversation,
  Internship,
  NotificationItem,
  RoadmapStep,
} from "../types";

interface ProfileState {
  fullName: string;
  title: string;
  university: string;
  location: string;
  goal: string;
  about: string;
  avatarColor: string;
  skills: string[];
  experiences: { id: string; role: string; company: string; period: string; description: string }[];
  education: { id: string; school: string; program: string; period: string }[];
  projects: { id: string; name: string; description: string; tags: string[] }[];
  certificates: { id: string; name: string; issuer: string; year: string }[];
  links: { id: string; label: string; url: string }[];
  interests: string[];
  preferences: {
    workType: string[];
    locations: string[];
    employmentType: string[];
  };
  strength: number;
}

const defaultProfile: ProfileState = {
  fullName: "Ada Yılmaz",
  title: "Frontend Developer · Öğrenci",
  university: "Boğaziçi Üniversitesi",
  location: "İstanbul",
  goal: "Ürün odaklı bir startup'ta üretim seviyesinde React tecrübesi kazanmak.",
  about:
    "Tasarım sistemleri ve ürün geliştirmeyle ilgilenen bir bilgisayar mühendisliği öğrencisiyim.",
  avatarColor: "#7c3aed",
  skills: ["React", "TypeScript", "TailwindCSS", "Figma", "Node.js", "GraphQL", "UI/UX"],
  experiences: [
    {
      id: "e1",
      role: "Açık Kaynak Katkıcısı",
      company: "Topluluk Projeleri",
      period: "2024 — Bugün",
      description:
        "React tabanlı tasarım sistemine 30+ PR katkısı, dokümantasyon iyileştirmeleri.",
    },
    {
      id: "e2",
      role: "Frontend Stajyer",
      company: "Lumen Studio",
      period: "Yaz 2024",
      description:
        "Müşteri portalının yeniden tasarımını gerçekleştirdim, performansı %35 artırdım.",
    },
  ],
  education: [
    {
      id: "ed1",
      school: "Boğaziçi Üniversitesi",
      program: "Bilgisayar Mühendisliği · 3. sınıf",
      period: "2022 — 2026",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Atlas Tasarım Sistemi",
      description: "Açık kaynak React + Tailwind tasarım sistemi.",
      tags: ["React", "Tailwind", "Storybook"],
    },
    {
      id: "p2",
      name: "PathMatch Mock",
      description: "Üniversite içi staj eşleştirme prototipi.",
      tags: ["Next.js", "TypeScript", "Figma"],
    },
  ],
  certificates: [
    { id: "c1", name: "Meta Frontend Sertifikası", issuer: "Meta / Coursera", year: "2024" },
    { id: "c2", name: "AWS Cloud Practitioner", issuer: "AWS", year: "2025" },
  ],
  links: [
    { id: "l1", label: "Portfolyo", url: "https://ada.dev" },
    { id: "l2", label: "GitHub", url: "https://github.com/ada" },
  ],
  interests: ["Ürün Tasarımı", "AI", "Açık Kaynak", "Eğitim Teknolojileri"],
  preferences: {
    workType: ["Hibrit", "Uzaktan"],
    locations: ["İstanbul", "Uzaktan"],
    employmentType: ["Staj", "Yarı Zamanlı"],
  },
  strength: 78,
};

interface AppDataCtx {
  internships: Internship[];
  applications: Application[];
  saved: string[];
  conversations: Conversation[];
  notifications: NotificationItem[];
  roadmap: RoadmapStep[];
  profile: ProfileState;
  // actions
  toggleSave: (id: string) => void;
  apply: (id: string) => void;
  setApplicationStatus: (id: string, status: ApplicationStatus) => void;
  withdraw: (id: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  startConversation: (data: Partial<Conversation> & { name: string }) => Conversation;
  updateProfile: (patch: Partial<ProfileState>) => void;
  toggleSkill: (skill: string) => void;
  addRoadmapStep: (step: Omit<RoadmapStep, "id">) => void;
  setRoadmapStatus: (id: string, status: RoadmapStep["status"]) => void;
}

const AppDataContext = createContext<AppDataCtx | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [internships] = useState<Internship[]>(seedInternships);

  const [applications, setApplications] = useState<Application[]>(() =>
    storage.get<Application[]>(STORAGE_KEYS.applications, [
      {
        id: "a1",
        internshipId: "ip-2",
        status: "applied",
        appliedAt: "12 Mayıs 2026",
        nextAction: "Mülakat hazırlığı",
      },
      {
        id: "a2",
        internshipId: "ip-4",
        status: "interview",
        appliedAt: "8 Mayıs 2026",
        nextAction: "Teknik mülakat 18 Mayıs",
      },
      {
        id: "a3",
        internshipId: "ip-7",
        status: "reviewed",
        appliedAt: "3 Mayıs 2026",
        nextAction: "Geri bildirim bekleniyor",
      },
    ])
  );
  const [saved, setSaved] = useState<string[]>(() =>
    storage.get<string[]>(STORAGE_KEYS.saved, ["ip-1", "ip-3"])
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    storage.get<Conversation[]>(STORAGE_KEYS.conversations, seedConversations)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    storage.get<NotificationItem[]>(STORAGE_KEYS.notifications, seedNotifications)
  );
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>(() =>
    storage.get<RoadmapStep[]>(STORAGE_KEYS.roadmap, seedRoadmap)
  );
  const [profile, setProfile] = useState<ProfileState>(() =>
    storage.get<ProfileState>(STORAGE_KEYS.profile, defaultProfile)
  );

  // persist on change
  useEffect(() => storage.set(STORAGE_KEYS.applications, applications), [applications]);
  useEffect(() => storage.set(STORAGE_KEYS.saved, saved), [saved]);
  useEffect(() => storage.set(STORAGE_KEYS.conversations, conversations), [conversations]);
  useEffect(() => storage.set(STORAGE_KEYS.notifications, notifications), [notifications]);
  useEffect(() => storage.set(STORAGE_KEYS.roadmap, roadmap), [roadmap]);
  useEffect(() => storage.set(STORAGE_KEYS.profile, profile), [profile]);

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const apply = useCallback(
    (id: string) => {
      setApplications((prev) => {
        if (prev.find((a) => a.internshipId === id)) return prev;
        const today = new Date().toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        return [
          {
            id: "a-" + Math.random().toString(36).slice(2, 7),
            internshipId: id,
            status: "applied",
            appliedAt: today,
            nextAction: "Başvuru gönderildi",
          },
          ...prev,
        ];
      });
    },
    []
  );

  const setApplicationStatus = useCallback((id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const withdraw = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    const newMsg: ChatMessage = {
      id: "m-" + Math.random().toString(36).slice(2, 7),
      from: "me",
      text,
      time,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: text,
              lastTime: "şimdi",
              unread: 0,
            }
          : c
      )
    );
    // simulate reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: "m-" + Math.random().toString(36).slice(2, 7),
        from: "them",
        text: "Çok teşekkürler, bilgileri aldım, en kısa sürede dönüş yapacağım.",
        time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, reply],
                lastMessage: reply.text,
                lastTime: "şimdi",
              }
            : c
        )
      );
    }, 1300);
  }, []);

  const startConversation = useCallback<AppDataCtx["startConversation"]>((data) => {
    const id = "c-" + Math.random().toString(36).slice(2, 7);
    const newConv: Conversation = {
      id,
      name: data.name,
      role: data.role || "Recruiter",
      company: data.company,
      avatarColor: data.avatarColor || "#7c3aed",
      online: data.online ?? true,
      lastMessage: data.lastMessage || "Yeni bir konuşma başlattınız.",
      lastTime: "şimdi",
      unread: 0,
      messages: data.messages || [],
    };
    setConversations((prev) => [newConv, ...prev]);
    return newConv;
  }, []);

  const updateProfile = useCallback((patch: Partial<ProfileState>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setProfile((prev) => {
      const has = prev.skills.includes(skill);
      const next = has ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill];
      const strength = Math.min(99, 50 + Math.min(40, next.length * 4));
      return { ...prev, skills: next, strength };
    });
  }, []);

  const addRoadmapStep = useCallback((step: Omit<RoadmapStep, "id">) => {
    setRoadmap((prev) => [...prev, { ...step, id: "r-" + Math.random().toString(36).slice(2, 7) }]);
  }, []);

  const setRoadmapStatus = useCallback((id: string, status: RoadmapStep["status"]) => {
    setRoadmap((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const value = useMemo<AppDataCtx>(
    () => ({
      internships,
      applications,
      saved,
      conversations,
      notifications,
      roadmap,
      profile,
      toggleSave,
      apply,
      setApplicationStatus,
      withdraw,
      markAllNotificationsRead,
      markNotificationRead,
      sendMessage,
      startConversation,
      updateProfile,
      toggleSkill,
      addRoadmapStep,
      setRoadmapStatus,
    }),
    [
      internships,
      applications,
      saved,
      conversations,
      notifications,
      roadmap,
      profile,
      toggleSave,
      apply,
      setApplicationStatus,
      withdraw,
      markAllNotificationsRead,
      markNotificationRead,
      sendMessage,
      startConversation,
      updateProfile,
      toggleSkill,
      addRoadmapStep,
      setRoadmapStatus,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
