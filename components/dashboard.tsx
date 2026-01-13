"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { TrendingUp, Clock, Target, Flame } from "lucide-react"
import { useSession } from "@/context/session-context"

export function Dashboard() {
  const { getTodayStats, getWeeklyData } = useSession()
  const { totalMinutes, sessionCount, avgFocusScore } = getTodayStats()
  const weeklyData = getWeeklyData()

  // Calculate streak (simplified - consecutive days with sessions)
  const streak = 5 // TODO: Implement actual streak calculation

  return (
    <div className="h-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your focus journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Target}
          label="Focus Score"
          value={`${avgFocusScore}%`}
          trend={sessionCount > 0 ? `${sessionCount} session${sessionCount > 1 ? 's' : ''} today` : "No sessions yet"}
          color="primary"
        />
        <StatCard
          icon={Clock}
          label="Today"
          value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
          trend={`${sessionCount} session${sessionCount !== 1 ? 's' : ''}`}
          color="accent"
        />
        <StatCard icon={Flame} label="Streak" value={`${streak} days`} trend="Keep it up!" color="primary" />
        <StatCard 
          icon={TrendingUp} 
          label="This Week" 
          value={`${(weeklyData.reduce((a, b) => a + b, 0) / 7).toFixed(0)}%`}
          trend="Average focus score" 
          color="accent" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Focus Score Ring */}
        <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Today&apos;s Focus</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${avgFocusScore * 4.4} 440`}
                  strokeLinecap="round"
                  className="text-primary drop-shadow-[0_0_8px_var(--primary)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-foreground">{avgFocusScore}%</span>
                <span className="text-xs text-muted-foreground">Focus Score</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {avgFocusScore >= 85
              ? "Excellent focus! Keep up the great work!"
              : avgFocusScore >= 70
              ? "Good job! You're staying focused."
              : avgFocusScore > 0
              ? "Keep practicing to improve your focus."
              : "Start a study session to track your focus."}
          </p>
        </Card>

        {/* Weekly Chart */}
        <Card className="col-span-2 p-6 bg-card/50 backdrop-blur-xl border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Weekly Focus Trend</h3>
          <div className="h-48 flex items-end justify-between gap-3 px-4">
            {weeklyData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary transition-all duration-300 hover:from-primary/80 hover:to-primary"
                  style={{ height: `${Math.max(value * 1.6, 10)}px` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Encouragement */}
      <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-medium">
            {sessionCount > 0 ? "Nice progress!" : "Ready to start?"}
          </span>{" "}
          <span className="text-muted-foreground">
            {sessionCount > 0
              ? `You've completed ${sessionCount} session${sessionCount > 1 ? 's' : ''} today. Keep up the momentum!`
              : "Begin your first study session to start tracking your progress."}
          </span>
        </p>
      </Card>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  trend: string
  color: "primary" | "accent"
}) {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-xl border-border/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        </div>
        <div className={`p-2 rounded-lg ${color === "primary" ? "bg-primary/15" : "bg-accent/15"}`}>
          <Icon className={`w-4 h-4 ${color === "primary" ? "text-primary" : "text-accent"}`} />
        </div>
      </div>
    </Card>
  )
}
