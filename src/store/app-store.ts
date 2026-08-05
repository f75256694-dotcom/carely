"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/utils";

interface AppState {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeRole: "family",
      setActiveRole: (role) => set({ activeRole: role }),
    }),
    { name: "carely-app-state" }
  )
);
