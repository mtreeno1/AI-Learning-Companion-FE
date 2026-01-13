"use client"

import { Card } from "@/components/ui/card"
import { Clock, Target, Calendar, Music2 } from "lucide-react"
import { useSession } from "@/context/session-context"

export function History() {
  const { sessions } = useSession()

  // Group sessions by date
  const groupedSessions = sessions
    .filter((s) => s.completed)
    .reduce(
      (acc, session) => {
        const date = new Date(session.startTime)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        let dateKey: string
        if (date.toDateString() === today.toDateString()) {
          dateKey = "Today"
        } else if (date.toDateString() === yesterday.toDateString()) {
          dateKey = "Yesterday"
        } else {
          dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        }

        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(session)
        return acc
      },
      {} as Record<string, typeof sessions>,
    )

  return (
    <div className="h-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">History</h1>
        <p className="text-muted-foreground text-sm mt-1">Review your past study sessions</p>
      </div>

      {/* Session List */}
      {Object.keys(groupedSessions).length === 0 ? (
        <Card className="p-8 bg-card/50 backdrop-blur-xl border-border/50 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No sessions yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a study session to begin tracking your progress.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([date, dateSessions]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-medium text-muted-foreground">{date}</h2>
              </div>
              <div className="space-y-2">
                {dateSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="p-4 bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/70 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {new Date(session.startTime).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">{session.duration} min</span>
                          <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground capitalize">
                            {session.mode}
                          </span>
                        </div>
                        
                        {/* Music tracks played */}
                        {session.musicTracks && session.musicTracks.length > 0 && (
                          <div className="flex items-start gap-2 mt-1">
                            <Music2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {session.musicTracks.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{session.focusScore}%</span>
                        <FocusIndicator score={session.focusScore} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FocusIndicator({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 85) return "bg-primary"
    if (score >= 70) return "bg-accent"
    return "bg-muted-foreground"
  }

  return (
    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full ${getColor()} transition-all`} style={{ width: `${score}%` }} />
    </div>
  )
}
