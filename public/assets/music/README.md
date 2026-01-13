# Focus Music Assets

This directory is for storing focus/study music files.

## Supported Formats
- MP3 (recommended)
- OGG
- WAV

## How to Add Music

1. Add your music files to this directory (`public/assets/music/`)
2. Update the track list in `/context/music-context.tsx` with your music files

### Example track entry:
```typescript
{
  id: "unique-id",
  title: "Track Title",
  artist: "Artist Name",
  url: "/assets/music/your-file.mp3",
}
```

## Default Tracks

The application comes with placeholders for the following tracks:
- Peaceful Piano
- Ambient Study
- Lofi Beats
- Nature Sounds

**Note**: You need to add your own music files with these names, or update the track list in the music context to match your available files.

## Recommended Music Types for Focus

- Lo-fi hip hop
- Classical piano
- Ambient soundscapes
- Nature sounds (rain, ocean, forest)
- White/brown noise
- Instrumental focus music

## Copyright Notice

Please ensure you have the rights to use any music files you add to this directory.
