# YouTube-like Video Player with Chunking

This guide covers the new YouTube-like video player with advanced chunking capabilities and frame preview functionality.

## 🎬 Features

### YouTube-like Video Player

- **Frame Preview on Timeline Hover**: Hover over the timeline to see frame previews, just like YouTube
- **Smooth Timeline Navigation**: Click anywhere on the timeline to seek instantly
- **Advanced Keyboard Shortcuts**: 30+ keyboard shortcuts for professional video analysis
- **Frame-accurate Seeking**: Navigate frame by frame with `,` and `.` keys
- **Playback Speed Control**: Variable speed from 0.25x to 8x
- **Volume Control**: Precise volume control with mute toggle
- **Fullscreen Support**: Full-screen video playback

### Video Chunking System

- **Configurable Chunk Duration**: Default 2 minutes, easily configurable
- **Automatic Chunking**: Large videos are automatically split into manageable chunks
- **Database Metadata**: Each chunk is tracked with start/end times and metadata
- **Efficient Streaming**: Only load the chunk you need for playback
- **Frame Preview Generation**: On-demand frame extraction from chunks

### Annotation System

- **Visual Timeline Markers**: Color-coded annotations on the timeline
- **Quick Annotation Creation**: Use keyboard shortcuts (1-5) for different types
- **Annotation Navigation**: Click annotations to jump to specific times
- **Rich Metadata**: Each annotation includes title, description, and timing

## 🚀 Quick Start

### 1. Run the Demo Setup

```bash
# Run the complete demo setup (includes chunking)
./scripts/demo-setup.sh

# Or with custom chunk duration
CHUNK_DURATION=60 ./scripts/demo-setup.sh  # 1-minute chunks
CHUNK_DURATION=300 ./scripts/demo-setup.sh # 5-minute chunks
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **GraphQL Playground**: http://localhost:8000/graphql

### 3. Try the Features

1. Open the demo video
2. Hover over the timeline to see frame previews
3. Use keyboard shortcuts for navigation
4. Click annotations to jump to specific sections

## ⌨️ Keyboard Shortcuts

### Playback Control

- `Space` or `K` - Play/Pause
- `J` - Rewind 10 seconds
- `L` - Forward 10 seconds
- `←` - Seek backward 5 seconds
- `→` - Seek forward 5 seconds
- `Shift + ←` - Seek backward 30 seconds
- `Shift + →` - Seek forward 30 seconds
- `Home` - Jump to start
- `End` - Jump to end

### Frame Control

- `,` - Previous frame
- `.` - Next frame
- `G` - Go to timestamp (prompt)

### Speed & Volume

- `[` - Decrease playback speed
- `]` - Increase playback speed
- `↑` - Volume up
- `↓` - Volume down
- `M` - Mute/Unmute

### View & Navigation

- `F` - Toggle fullscreen
- `?` - Show keyboard shortcuts help

### Annotations

- `1` - Critical incident
- `2` - Suspicious activity
- `3` - Policy violation
- `4` - Note
- `5` - Evidence marker
- `Shift + M` - Mark annotation at current time

## 🔧 Configuration

### Chunk Duration

The video chunking duration is configurable via environment variable:

```bash
# Set chunk duration (in seconds)
export CHUNK_DURATION=120  # 2 minutes (default)
export CHUNK_DURATION=60   # 1 minute
export CHUNK_DURATION=300  # 5 minutes
```

### Video Processing

The system automatically:

1. Detects video metadata (duration, FPS, resolution)
2. Splits videos into chunks of the specified duration
3. Stores chunk metadata in PostgreSQL
4. Generates frame previews on demand

## 📁 File Structure

```
backend-fastapi/
├── videos/
│   ├── chunks/          # Video chunks (2-minute segments)
│   ├── thumbnails/      # Generated thumbnails
│   └── *.mp4           # Original video files
├── app/
│   ├── models/
│   │   └── video_chunk.py    # Video chunk database model
│   ├── schemas/
│   │   └── video_chunk.py    # API schemas
│   ├── services/
│   │   └── video_processing.py  # Chunking and frame extraction
│   └── api/api_v1/endpoints/
│       └── video_chunks.py     # Chunk API endpoints
```

## 🎯 API Endpoints

### Video Chunks

- `GET /api/v1/videos/{video_id}/chunks` - Get all chunks for a video
- `GET /api/v1/videos/{video_id}/chunks/{chunk_id}` - Get specific chunk
- `GET /api/v1/videos/{video_id}/chunks/{chunk_id}/stream` - Stream chunk
- `GET /api/v1/videos/{video_id}/frame/{time_seconds}` - Get frame preview
- `GET /api/v1/videos/{video_id}/timeline-thumbnails` - Get timeline thumbnails

### Example Usage

```javascript
// Get frame preview for specific time
const response = await fetch(`/api/v1/videos/${videoId}/frame/120`);
const frameBlob = await response.blob();
const frameUrl = URL.createObjectURL(frameBlob);

// Get all chunks for a video
const chunks = await fetch(`/api/v1/videos/${videoId}/chunks`);
const chunkData = await chunks.json();
```

## 🏗️ Architecture

### Backend (FastAPI + Python)

- **Video Processing**: FFmpeg for video chunking and frame extraction
- **Database**: PostgreSQL with chunk metadata
- **API**: RESTful endpoints for chunk streaming and frame previews
- **Async Processing**: Non-blocking video processing

### Frontend (Next.js + React + TypeScript)

- **Video Player**: Custom YouTube-like player component
- **Frame Preview**: On-demand frame loading with caching
- **Timeline**: Interactive timeline with hover previews
- **State Management**: Zustand for player state

### Video Chunking Flow

1. **Upload**: Video uploaded to backend
2. **Analysis**: FFmpeg analyzes video metadata
3. **Chunking**: Video split into configurable chunks
4. **Storage**: Chunks stored in filesystem, metadata in database
5. **Streaming**: Frontend requests specific chunks as needed
6. **Frame Preview**: On-demand frame extraction from chunks

## 🔍 Performance Optimizations

### Chunking Benefits

- **Faster Seeking**: Only load relevant chunks
- **Reduced Bandwidth**: Stream only what's needed
- **Better Caching**: Browser can cache individual chunks
- **Parallel Loading**: Load multiple chunks simultaneously

### Frame Preview Optimizations

- **Lazy Loading**: Frames generated only when needed
- **Caching**: Frame previews cached in browser
- **Compression**: JPEG compression for frame previews
- **Async Generation**: Non-blocking frame extraction

## 🛠️ Development

### Adding New Features

1. **Backend**: Add endpoints in `video_chunks.py`
2. **Frontend**: Extend `YouTubeLikeVideoPlayer.tsx`
3. **Database**: Update models and run migrations
4. **Testing**: Use the demo setup script

### Customizing Chunk Duration

```python
# In video_processing.py
video_service = VideoProcessingService(chunk_duration=60)  # 1 minute
```

### Adding New Keyboard Shortcuts

```typescript
// In YouTubeLikeVideoPlayer.tsx
useKeyboardShortcuts([
  { key: 'n', action: () => newFeature(), description: 'New feature' },
  // ... existing shortcuts
]);
```

## 🐛 Troubleshooting

### Common Issues

**Frame previews not loading?**

- Check if video chunks exist in `backend-fastapi/videos/chunks/`
- Verify FFmpeg is installed and accessible
- Check browser console for API errors

**Video not chunking?**

- Ensure video file exists in `backend-fastapi/videos/`
- Check database connection
- Verify video processing service is running

**Keyboard shortcuts not working?**

- Ensure video player has focus
- Check if shortcuts are disabled in browser
- Press `?` to see available shortcuts

### Debug Mode

```bash
# Enable debug logging
export DEBUG=1
./scripts/demo-setup.sh
```

## 📊 Monitoring

### Chunk Statistics

- Total chunks created
- Average chunk size
- Processing time per chunk
- Frame preview generation time

### Performance Metrics

- Chunk loading time
- Frame preview response time
- Memory usage during playback
- Network bandwidth usage

## 🔮 Future Enhancements

### Planned Features

- **Adaptive Bitrate**: Dynamic quality based on connection
- **Thumbnail Sprites**: Pre-generated thumbnail strips
- **Advanced Analytics**: Detailed playback analytics
- **Multi-format Support**: Support for more video formats
- **Cloud Storage**: Integration with cloud storage providers

### Customization Options

- **Custom Timeline**: Configurable timeline appearance
- **Theme Support**: Dark/light mode themes
- **Plugin System**: Extensible plugin architecture
- **API Extensions**: Custom API endpoints

---

**Ready to experience the YouTube-like video player?** Run `./scripts/demo-setup.sh` and start exploring! 🎬
