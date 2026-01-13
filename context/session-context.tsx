"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMusic } from "./music-context";
import { useAuth } from "./auth-context";

export interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes (calculated or from duration_seconds)
  mode: "pomodoro" | "manual";
  focusScore: number;
  musicTracks?: string[]; // Track titles played during session
  completed: boolean;
  // Backend fields
  sessionName?: string;
  subject?: string;
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
  refreshSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const STORAGE_KEY = "study_sessions";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const { currentTrack } = useMusic();
  const { user } = useAuth();

  // Fetch sessions from backend
  const fetchBackendSessions = async () => {
    if (!user?.token) return;

    try {
      console.log("📥 Fetching sessions from backend...");
      const response = await fetch(`${API_BASE_URL}/api/focus/sessions`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch sessions:", response.status);
        return;
      }

      const data = await response.json();
      console.log("✅ Fetched sessions from backend:", data);

      // Handle different response formats
      let sessionsArray: any[] = [];
      
      if (Array.isArray(data)) {
        // Direct array response
        sessionsArray = data;
      } else if (data && Array.isArray(data.sessions)) {
        // Object with sessions property
        sessionsArray = data.sessions;
      } else if (data && Array.isArray(data.data)) {
        // Object with data property
        sessionsArray = data.data;
      } else {
        console.warn("Unexpected response format:", data);
        // Fallback to localStorage if format is unexpected
        loadLocalSessions();
        return;
      }

      // Transform backend sessions to our format
      const transformedSessions: StudySession[] = sessionsArray.map((session: any) => ({
        id: session.session_id,
        startTime: new Date(session.started_at),
        endTime: session.ended_at ? new Date(session.ended_at) : undefined,
        duration: session.duration_seconds 
          ? Math.round(session.duration_seconds / 60) 
          : 25, // Default to 25 min if not available
        mode: "pomodoro" as const, // Default to pomodoro, could be inferred from duration
        focusScore: session.final_score || session.current_score || session.average_score || 0,
        musicTracks: [], // Backend doesn't track music yet
        completed: !!session.ended_at,
        sessionName: session.session_name,
        subject: session.subject,
      })).filter((s: StudySession) => s.completed); // Only show completed sessions

      setSessions(transformedSessions);
      
      // Also save to localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transformedSessions));
    } catch (error) {
      console.error("Error fetching backend sessions:", error);
      // Fallback to localStorage if backend fails
      loadLocalSessions();
    }
  };

  // Load sessions from localStorage as fallback
  const loadLocalSessions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : undefined,
        }));
        setSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error("Error loading local sessions:", error);
    }
  };

  // Initial load - try backend first, fallback to localStorage
  useEffect(() => {
    if (user?.token) {
      fetchBackendSessions();
    } else {
      loadLocalSessions();
    }
  }, [user?.token]);

  // Refresh sessions periodically when user is logged in
  useEffect(() => {
    if (!user?.token) return;

    const interval = setInterval(() => {
      fetchBackendSessions();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user?.token]);

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
    
    // Save to localStorage
    const updatedSessions = [completedSession, ...sessions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    
    setCurrentSession(null);

    // Refresh from backend after a short delay
    if (user?.token) {
      setTimeout(() => {
        fetchBackendSessions();
      }, 2000);
    }
  };

  const updateSessionMusic = (trackTitle: string) => {
    if (!currentSession) return;

    setCurrentSession((prev) => {
      if (!prev) return prev;
      
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

  const refreshSessions = async () => {
    if (user?.token) {
      await fetchBackendSessions();
    }
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
        refreshSessions,
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
