// Example configuration for adding your own music tracks
// This is a sample file - actual configuration is done in context/music-context.tsx

import type { MusicTrack } from "@/context/music-context";

// Example 1: Local music files
export const localTracks: MusicTrack[] = [
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
];

// Example 2: External music URLs (make sure you have rights to use them)
export const externalTracks: MusicTrack[] = [
  {
    id: "3",
    title: "Lofi Hip Hop",
    artist: "ChilledCow",
    url: "https://example.com/music/lofi-hiphop.mp3",
  },
];

// Example 3: Mix of local and external
export const mixedTracks: MusicTrack[] = [
  ...localTracks,
  ...externalTracks,
];

// To use these tracks:
// 1. Copy this configuration
// 2. Open context/music-context.tsx
// 3. Replace the defaultTracks array with your configuration
// 4. Make sure your music files are in the public/assets/music/ directory

/* Example update in context/music-context.tsx:

const defaultTracks: MusicTrack[] = [
  {
    id: "1",
    title: "My Focus Music",
    artist: "Study Time",
    url: "/assets/music/my-music.mp3",
  },
  // Add more tracks here...
];

*/
