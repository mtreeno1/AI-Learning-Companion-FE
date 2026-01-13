# Focus Music Player Feature

## Overview

The Focus Music Player is a built-in music player component designed to help students maintain concentration during study sessions. It supports continuous playback, track selection, and volume control.

## Features

### 1. **Music Playback**
- Play/Pause controls
- Next/Previous track navigation
- Automatic continuous playback (plays next track when current ends)
- Volume control with mute option

### 2. **Track Management**
- Visual track list with current playing indicator
- Click any track to play immediately
- Smooth transitions between tracks

### 3. **Integration**
- Integrated into the Study Mode interface
- Accessible during study sessions
- Does not interfere with focus tracking

## Usage

### For Users

1. **Start Playing Music:**
   - Navigate to the Study Mode
   - The music player appears on the right side panel
   - Click the Play button to start playing the first track
   - Use Next/Previous buttons to change tracks

2. **Select a Specific Track:**
   - Scroll through the track list
   - Click on any track title to play it immediately

3. **Adjust Volume:**
   - Use the volume slider at the bottom of the player
   - Click the speaker icon to mute/unmute

### For Developers

#### Adding Music Files

1. Place your music files in `public/assets/music/`
2. Update the track list in `context/music-context.tsx`:

```typescript
const defaultTracks: MusicTrack[] = [
  {
    id: "unique-id",
    title: "Your Track Title",
    artist: "Artist Name",
    url: "/assets/music/your-file.mp3",
  },
  // Add more tracks...
];
```

#### Using the Music Context

The music player uses React Context for state management. You can access it anywhere in your app:

```typescript
import { useMusic } from "@/context/music-context";

function YourComponent() {
  const { 
    currentTrack,
    isPlaying,
    togglePlay,
    selectTrack 
  } = useMusic();
  
  // Use the music state and controls
}
```

## Architecture

### Components

1. **MusicProvider** (`context/music-context.tsx`)
   - Manages global music state
   - Controls audio playback
   - Handles track navigation
   - Provides context to all components

2. **FocusMusicPlayer** (`components/focus-music-player.tsx`)
   - UI component for music controls
   - Track list display
   - Volume controls
   - Playback controls

### State Management

The music player uses the following state:
- `currentTrack`: Currently playing track
- `isPlaying`: Playback state
- `volume`: Current volume (0-1)
- `tracks`: Available music tracks

### Audio Handling

- Uses HTML5 Audio API
- Automatic cleanup on unmount
- Error handling for failed playback
- Continuous playback with auto-advance

## Customization

### Styling

The music player uses Tailwind CSS and follows the app's design system. You can customize:
- Card styling in `components/focus-music-player.tsx`
- Colors via CSS variables
- Layout by modifying the component structure

### Track Sources

You can use music from:
- Local files in `/public/assets/music/`
- External URLs (ensure CORS is configured)
- CDN-hosted files

## Technical Details

### Supported Audio Formats
- MP3 (recommended)
- OGG
- WAV
- Any format supported by HTML5 Audio

### Browser Compatibility
- Modern browsers with HTML5 Audio support
- Tested on Chrome, Firefox, Safari, Edge

### Performance
- Minimal CPU usage
- Audio preloading disabled by default
- Efficient memory management

## Future Enhancements

Potential improvements:
- Playlist management (save/load playlists)
- Shuffle and repeat modes
- Audio visualization
- Background music for other modes
- Integration with streaming services
- Time-based auto-play (start music with timer)
- Sound effects for focus alerts

## Troubleshooting

### Music Not Playing

1. Check if audio files exist in `/public/assets/music/`
2. Verify file paths in `context/music-context.tsx`
3. Check browser console for errors
4. Ensure browser allows audio playback (some browsers require user interaction)

### Volume Issues

- Some browsers may have different volume control behaviors
- System volume also affects playback
- Check browser's audio settings

### File Not Found

- Ensure files are in the correct directory
- File paths are case-sensitive
- Check file extensions match the URLs

## License Note

Users must ensure they have the rights to use any music files added to the application. The application does not include any copyrighted music files.
