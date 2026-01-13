"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
}

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  tracks: MusicTrack[];
  play: (track?: MusicTrack) => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  selectTrack: (trackId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Default focus music tracks
const defaultTracks: MusicTrack[] = [
  {
    id: "1",
    title: "Peaceful Piano",
    artist: "Focus Sounds",
    url: "/assets/music/peaceful-piano.mp3",
  },
  {
    id: "2",
    title: "Ambient Study",
    artist: "Concentration Music",
    url: "/assets/music/ambient-study.mp3",
  },
  {
    id: "3",
    title: "Lofi Beats",
    artist: "Study Vibes",
    url: "/assets/music/lofi-beats.mp3",
  },
  {
    id: "4",
    title: "Nature Sounds",
    artist: "Relaxation",
    url: "/assets/music/nature-sounds.mp3",
  },
];

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [tracks] = useState<MusicTrack[]>(defaultTracks);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.loop = false;

    // Handle track end - play next track automatically
    const handleEnded = () => {
      playNext();
    };

    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (track?: MusicTrack) => {
    if (!audioRef.current) return;

    if (track) {
      // Play a specific track
      setCurrentTrack(track);
      audioRef.current.src = track.url;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    } else if (currentTrack) {
      // Resume current track
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    } else if (tracks.length > 0) {
      // No track selected, play first track
      play(tracks[0]);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };

  const playNext = () => {
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    play(tracks[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    play(tracks[previousIndex]);
  };

  const selectTrack = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (track) {
      play(track);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        tracks,
        play,
        pause,
        togglePlay,
        setVolume,
        playNext,
        playPrevious,
        selectTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
