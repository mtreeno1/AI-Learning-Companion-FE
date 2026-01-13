"use client";

import { useMusic } from "@/context/music-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FocusMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    tracks,
    togglePlay,
    setVolume,
    playNext,
    playPrevious,
    selectTrack,
  } = useMusic();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Music className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Focus Music</h3>
        </div>
        
        {currentTrack && (
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground truncate">
              {currentTrack.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentTrack.artist}
            </p>
          </div>
        )}

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={playPrevious}
            disabled={tracks.length === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            size="icon"
            className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={togglePlay}
            disabled={tracks.length === 0}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              // Slight left margin to visually center the play triangle icon
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={playNext}
            disabled={tracks.length === 0}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </div>

      {/* Track List */}
      <ScrollArea className="h-48">
        <div className="p-2">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg transition-colors",
                "hover:bg-muted/50",
                currentTrack?.id === track.id
                  ? "bg-primary/10 text-primary"
                  : "text-foreground"
              )}
            >
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
