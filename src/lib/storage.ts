// Tiny localStorage helper with safe JSON parse and SSR safety.
const KEY_PREFIX = "pm.";

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      if (typeof window === "undefined") return fallback;
      const raw = window.localStorage.getItem(KEY_PREFIX + key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      // ignore quota or privacy errors
    }
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(KEY_PREFIX + key);
    } catch {
      // ignore
    }
  },
};

export const STORAGE_KEYS = {
  auth: "auth.user",
  applications: "data.applications",
  saved: "data.saved",
  conversations: "data.conversations",
  notifications: "data.notifications",
  profile: "data.profile",
  roadmap: "data.roadmap",
  settings: "data.settings",
  // Company-side
  cPostings: "company.postings",
  cTalent: "company.talent",
  cInterviews: "company.interviews",
  cTeam: "company.team",
  cConversations: "company.conversations",
  cProfile: "company.profile",
  cInvoices: "company.invoices",
  cSettings: "company.settings",
} as const;
