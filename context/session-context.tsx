"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMusic } from "./music-context";

export interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  mode: "pomodoro" | "manual";
  focusScore: number;
  musicTracks?: string[]; // Track titles played during session
  completed: boolean;
}

interface SessionContextType {
  sessions: StudySession[];
  currentSession: StudySession | null;
  startSession: (mode: "pomodoro" | "manual", duration: number) => void;
  endSession: (focusScore: number) => void;
  updateSessionMusic: (trackTitle: string) => void;
  getTodayStats: () => {
    totalMinutes: number;
    sessionCount: number;
    avgFocusScore: number;
  };
  getWeeklyData: () => number[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const STORAGE_KEY = "study_sessions";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const { currentTrack } = useMusic();

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : undefined,
        }));
        setSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving sessions:", error);
    }
  }, [sessions]);

  // Track music changes during session
  useEffect(() => {
    if (currentSession && currentTrack) {
      updateSessionMusic(currentTrack.title);
    }
  }, [currentTrack, currentSession]);

  const startSession = (mode: "pomodoro" | "manual", duration: number) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration,
      mode,
      focusScore: 100, // Start with perfect score
      musicTracks: [],
      completed: false,
    };
    setCurrentSession(newSession);
  };

  const endSession = (focusScore: number) => {
    if (!currentSession) return;

    const completedSession: StudySession = {
      ...currentSession,
      endTime: new Date(),
      focusScore,
      completed: true,
    };

    setSessions((prev) => [completedSession, ...prev]);
    setCurrentSession(null);
  };

  const updateSessionMusic = (trackTitle: string) => {
    if (!currentSession) return;

    setCurrentSession((prev) => {
      if (!prev) return prev;
      
      // Only add if not already in the list
      const musicTracks = prev.musicTracks || [];
      if (!musicTracks.includes(trackTitle)) {
        return {
          ...prev,
          musicTracks: [...musicTracks, trackTitle],
        };
      }
      return prev;
    });
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime() && s.completed;
    });

    const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const sessionCount = todaySessions.length;
    const avgFocusScore =
      sessionCount > 0
        ? Math.round(todaySessions.reduce((sum, s) => sum + s.focusScore, 0) / sessionCount)
        : 0;

    return { totalMinutes, sessionCount, avgFocusScore };
  };

  const getWeeklyData = () => {
    const today = new Date();
    const weekData: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const daySessions = sessions.filter((s) => {
        const sessionDate = new Date(s.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime() && s.completed;
      });

      const avgScore =
        daySessions.length > 0
          ? Math.round(daySessions.reduce((sum, s) => sum + s.focusScore, 0) / daySessions.length)
          : 0;

      weekData.push(avgScore);
    }

    return weekData;
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSession,
        startSession,
        endSession,
        updateSessionMusic,
        getTodayStats,
        getWeeklyData,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
