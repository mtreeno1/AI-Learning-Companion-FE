# Session Tracking and Visualization Feature

## Overview

The session tracking feature automatically records study sessions including music played, duration, mode, and focus scores. This data is visualized in the Dashboard and History views.

## Implementation (Vietnamese)

### Tính năng đã thêm

Hệ thống giờ đây tự động **lưu lại thông tin phiên học** bao gồm:

1. **Thông tin phiên học**
   - Thời gian bắt đầu và kết thúc
   - Thời lượng học tập
   - Chế độ (Pomodoro hoặc Manual)
   - Điểm tập trung (Focus Score)
   - **Danh sách nhạc đã phát** trong phiên học

2. **Trực quan hóa trong Dashboard**
   - Điểm tập trung trung bình hôm nay
   - Tổng thời gian học hôm nay
   - Biểu đồ xu hướng 7 ngày
   - Thống kê động theo dữ liệu thực

3. **Lịch sử trong History**
   - Danh sách tất cả phiên học
   - Nhóm theo ngày (Hôm nay, Hôm qua, các ngày khác)
   - **Hiển thị nhạc đã phát** trong mỗi phiên
   - Điểm tập trung với thanh chỉ báo màu

## How It Works

### Automatic Session Tracking

1. **When you start a study session:**
   - System creates a new session record
   - Tracks session mode (Pomodoro/Manual) and duration
   - Begins monitoring music playback

2. **During the session:**
   - Automatically records each music track played
   - Updates session data in real-time
   - No user interaction required

3. **When session completes:**
   - Calculates final focus score
   - Saves complete session to localStorage
   - Shows completion notification
   - Updates Dashboard and History immediately

### Data Storage

All session data is stored in **localStorage** with key `study_sessions`:

```typescript
interface StudySession {
  id: string                  // Unique session ID
  startTime: Date            // When session started
  endTime?: Date             // When session ended
  duration: number           // Planned duration in minutes
  mode: "pomodoro" | "manual" // Study mode
  focusScore: number         // Focus score (0-100)
  musicTracks?: string[]     // Track titles played
  completed: boolean         // Whether session finished
}
```

### Dashboard Statistics

The Dashboard shows:
- **Focus Score**: Average of all sessions today
- **Today's Time**: Total minutes studied today
- **Session Count**: Number of sessions completed today
- **Weekly Trend**: Average focus scores for last 7 days

### History View

Shows all completed sessions with:
- **Grouped by Date**: Today, Yesterday, or specific date
- **Time**: When session started
- **Duration**: How long it lasted
- **Mode**: Pomodoro or Manual
- **Music Tracks**: List of songs played (shown with 🎵 icon)
- **Focus Score**: Visual indicator bar

## Technical Details

### Components Modified

1. **SessionProvider** (`context/session-context.tsx`)
   - New context for managing session state
   - Provides functions: `startSession`, `endSession`, `updateSessionMusic`
   - Statistics helpers: `getTodayStats`, `getWeeklyData`

2. **Dashboard** (`components/dashboard.tsx`)
   - Removed mock data
   - Uses `useSession()` hook for real data
   - Dynamic messages based on actual sessions

3. **History** (`components/history.tsx`)
   - Removed mock data
   - Displays real sessions from localStorage
   - Shows music tracks with Music2 icon
   - Empty state for new users

4. **StudyMode** (`components/study-mode.tsx`)
   - Calls `startSession()` when study begins
   - Calls `endSession()` when timer reaches zero
   - Auto-tracks music via SessionProvider
   - Shows toast notification on completion

5. **Layout** (`app/layout.tsx`)
   - Added SessionProvider wrapper
   - Added Toaster component for notifications

### Music Tracking Integration

The SessionProvider automatically tracks music by:
1. Listening to `currentTrack` changes from MusicContext
2. Adding track title to current session's `musicTracks` array
3. Preventing duplicates (only adds each track once)

This happens transparently - no changes needed to music player.

## User Benefits

### For Students
- 📊 **See your progress** - Visual stats show improvement over time
- 🎵 **Remember what works** - Know which music helped you focus
- 📈 **Track consistency** - Weekly trends show study habits
- 🎯 **Measure focus** - Focus scores help identify best conditions

### For Study Optimization
- See which music genres correlate with high focus
- Identify optimal study times and durations
- Track consistency with streak and daily stats
- Review past sessions to improve future performance

## Future Enhancements

Potential improvements:
- [ ] Export session data to CSV/JSON
- [ ] Filter history by date range or focus score
- [ ] Advanced analytics (best music for focus, optimal study times)
- [ ] Sync data across devices (requires backend)
- [ ] Compare sessions side-by-side
- [ ] Set goals and track achievements

## Example Session Flow

```
1. User selects Pomodoro mode (25 min)
2. User clicks "Start"
   → SessionProvider.startSession("pomodoro", 25) called
   
3. User plays "Peaceful Piano" from music player
   → SessionProvider.updateSessionMusic("Peaceful Piano") called
   
4. User switches to "Lofi Beats"
   → SessionProvider.updateSessionMusic("Lofi Beats") called
   
5. Timer reaches 0:00
   → SessionProvider.endSession(85) called with focus score
   → Session saved to localStorage
   → Toast notification shows: "Session Completed! 🎉 Focus score: 85%"
   
6. User navigates to Dashboard
   → Shows updated stats including this session
   
7. User navigates to History
   → Shows new session with "Peaceful Piano, Lofi Beats" listed
```

## Data Privacy

- All data stored **locally** in browser localStorage
- No data sent to external servers
- User can clear data by clearing browser storage
- No personal information collected

## Troubleshooting

### Sessions not saving
- Check browser localStorage is enabled
- Check browser console for errors
- Ensure session completes (timer reaches 0)

### Dashboard shows 0%
- Complete at least one session
- Refresh the page
- Check localStorage has "study_sessions" key

### Music not tracked
- Ensure music player is playing during session
- Check MusicContext is properly integrated
- Verify track has a title property
