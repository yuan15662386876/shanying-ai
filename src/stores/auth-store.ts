"use client";

import { create } from "zustand";

interface UserProfile {
  id: string;
  phone: string;
  displayName: string | null;
  role: string;
  credits: number;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),

  initialize: async () => {
    if (get().isInitialized) return;

    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({
          user: data.user,
          isLoading: false,
          isInitialized: true,
        });
        return;
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    }

    set({ user: null, isLoading: false, isInitialized: true });
  },

  signOut: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore errors on logout
    }
    set({ user: null });
    window.location.href = "/login";
  },
}));
