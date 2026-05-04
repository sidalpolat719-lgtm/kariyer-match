import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, UserRole } from "../types";
import { STORAGE_KEYS, storage } from "../lib/storage";

interface AuthCtx {
  user: AuthUser | null;
  isAuthed: boolean;
  login: (data: { email: string; role?: UserRole; remember?: boolean }) => AuthUser;
  register: (data: {
    fullName: string;
    email: string;
    role: UserRole;
    organization?: string;
  }) => AuthUser;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

const accentColors = ["#7c3aed", "#06b6d4", "#10b981", "#0d1a3a", "#f59e0b", "#ec4899"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(storage.get<AuthUser | null>(STORAGE_KEYS.auth, null));
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) storage.set(STORAGE_KEYS.auth, u);
    else storage.remove(STORAGE_KEYS.auth);
  };

  const login: AuthCtx["login"] = useCallback(({ email, role }) => {
    const stored = storage.get<AuthUser | null>(STORAGE_KEYS.auth, null);
    const fallbackName = email.split("@")[0].replace(/[._-]/g, " ");
    const u: AuthUser =
      stored && stored.email === email
        ? { ...stored, role: role ?? stored.role }
        : {
            id: "u-" + Math.random().toString(36).slice(2, 8),
            email,
            fullName: stored?.fullName || capitalize(fallbackName),
            role: role ?? "student",
            avatarColor: accentColors[Math.floor(Math.random() * accentColors.length)],
          };
    persist(u);
    return u;
  }, []);

  const register: AuthCtx["register"] = useCallback((data) => {
    const u: AuthUser = {
      id: "u-" + Math.random().toString(36).slice(2, 8),
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      organization: data.organization,
      avatarColor: accentColors[Math.floor(Math.random() * accentColors.length)],
    };
    persist(u);
    return u;
  }, []);

  const logout = useCallback(() => persist(null), []);

  const updateUser: AuthCtx["updateUser"] = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      storage.set(STORAGE_KEYS.auth, next);
      return next;
    });
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, isAuthed: !!user, login, register, logout, updateUser }),
    [user, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function capitalize(s: string) {
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}
