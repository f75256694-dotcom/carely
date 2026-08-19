"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type MoodType = "super" | "ruhig" | "auffaellig" | "";

export type PhotoMoment = {
  id: string;
  title: string;
  image: string;
  caption: string;
  date: string;
};

export type FamilyHealthState = {
  ernahrung: boolean;
  bewegung: number;
  medikamente: boolean;
};

export type FamilyDataContextValue = {
  mood: MoodType;
  health: FamilyHealthState;
  photoMoments: PhotoMoment[];
  trendHistory: number[];
  setMood: (value: MoodType) => void;
  updateHealth: (updates: Partial<FamilyHealthState>) => void;
  addPhotoMoment: (moment: PhotoMoment) => void;
  addTrendPoint: (value: number) => void;
};

const FamilyDataContext = createContext<FamilyDataContextValue | null>(null);

export function FamilyDataProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMood] = useState<MoodType>("");
  const [health, setHealth] = useState<FamilyHealthState>({ ernahrung: false, bewegung: 0, medikamente: false });
  const [trendHistory, setTrendHistory] = useState<number[]>([42, 55, 49, 63, 58, 70, 66]);
  const [photoMoments, setPhotoMoments] = useState<PhotoMoment[]>([
    {
      id: "moment-cook",
      title: "Gemeinsames Kochen",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
      caption: "Eine warme Mahlzeit gemeinsam zubereitet.",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "moment-walk",
      title: "Spaziergang im Park",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      caption: "Frische Luft und Ruhe im Grünen.",
      date: new Date().toISOString().split("T")[0],
    },
    {
      id: "moment-games",
      title: "Brettspiel-Nachmittag",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      caption: "Gemeinsame Zeit bei Spiel und Gespräch.",
      date: new Date().toISOString().split("T")[0],
    },
  ]);

  const value = useMemo(
    () => ({
      mood,
      health,
      photoMoments,
      trendHistory,
      setMood,
      updateHealth: (updates: Partial<FamilyHealthState>) => setHealth((prev) => ({ ...prev, ...updates })),
      addPhotoMoment: (moment: PhotoMoment) => setPhotoMoments((current) => [moment, ...current]),
      addTrendPoint: (value: number) => setTrendHistory((current) => [...current.slice(-6), Math.max(0, Math.min(100, value))]),
    }),
    [health, mood, photoMoments, trendHistory]
  );

  return <FamilyDataContext.Provider value={value}>{children}</FamilyDataContext.Provider>;
}

export function useFamilyData() {
  const context = useContext(FamilyDataContext);
  if (!context) throw new Error("useFamilyData must be used within FamilyDataProvider");
  return context;
}
