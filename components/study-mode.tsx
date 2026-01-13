"use client"

import { useState, useEffect } from "react"
import { CameraPreview } from "@/components/camera-preview"
import { HourglassTimer } from "@/components/hourglass-timer"
import { ModeSelector } from "@/components/mode-selector"
import { FocusMusicPlayer } from "@/components/focus-music-player"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Video } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useSession } from "@/context/session-context"
import { useToast } from "@/hooks/use-toast"

export type StudyModeType = "pomodoro" | "manual" | null

export function StudyMode() {
  const [selectedMode, setSelectedMode] = useState<StudyModeType>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(25 * 60) // 25 minutes default
  const [manualDuration, setManualDuration] = useState(30) // 30 minutes default for manual
  const [enableRecording, setEnableRecording] = useState(false) // ✅ Recording option
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  
  const { startSession, endSession, currentSession } = useSession()
  const { toast } = useToast()

  const handleModeSelect = (mode: StudyModeType) => {
    setSelectedMode(mode)
    if (mode === "pomodoro") {
      setTimeRemaining(25 * 60)
    } else if (mode === "manual") {
      setTimeRemaining(manualDuration * 60)
    }
    setIsRunning(false)
  }

  const handleStart = () => {
    setIsRunning(true)
    setSessionStartTime(Date.now())
    
    // Start tracking session
    if (selectedMode) {
      const duration = selectedMode === "pomodoro" ? 25 : manualDuration
      startSession(selectedMode, duration)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    if (selectedMode === "pomodoro") {
      setTimeRemaining(25 * 60)
    } else {
      setTimeRemaining(manualDuration * 60)
    }
    setSessionStartTime(null)
  }

  // Handle session completion
  useEffect(() => {
    if (timeRemaining === 0 && isRunning && currentSession) {
      setIsRunning(false)
      
      // Calculate focus score (simplified - in real app would come from AI)
      const focusScore = Math.floor(Math.random() * 30) + 70 // 70-100%
      
      endSession(focusScore)
      
      toast({
        title: "Session Completed! 🎉",
        description: `Great work! Focus score: ${focusScore}%`,
      })
      
      setSessionStartTime(null)
    }
  }, [timeRemaining, isRunning, currentSession, endSession, toast])

  const totalTime = selectedMode === "pomodoro" ? 25 * 60 : manualDuration * 60

  if (!selectedMode) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <ModeSelector
          onSelect={handleModeSelect}
          onManualDurationChange={setManualDuration}
          manualDuration={manualDuration}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Study Session</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {selectedMode === "pomodoro" ? "Pomodoro Mode - 25 min focus" : `Manual Mode - ${manualDuration} min`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="recording-mode"
              checked={enableRecording}
              onCheckedChange={setEnableRecording}
              disabled={isRunning}
            />
            <Label htmlFor="recording-mode" className="text-sm flex items-center gap-1 cursor-pointer">
              <Video className="w-4 h-4" />
              Record Session
            </Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedMode(null)}
            className="text-muted-foreground hover:text-foreground"
            disabled={isRunning}
          >
            Change Mode
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-8 items-stretch">
        {/* Camera Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <CameraPreview enableRecording={enableRecording} />
        </div>

        {/* Right Sidebar with Timer and Music Player */}
        <div className="w-96 flex flex-col gap-6">
          {/* Hourglass Timer */}
          <div className="flex flex-col items-center justify-center">
            <HourglassTimer
              timeRemaining={timeRemaining}
              totalTime={totalTime}
              isRunning={isRunning}
              onTimeUpdate={setTimeRemaining}
            />

            {/* Controls */}
            <div className="flex gap-3 mt-8">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
                >
                  <Play className="w-4 h-4" />
                  Start
                </Button>
              ) : (
                <Button onClick={handlePause} variant="secondary" className="gap-2 px-6">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" size="icon" className="border-border bg-transparent">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Music Player */}
          <FocusMusicPlayer />
        </div>
      </div>
    </div>
  )
}
