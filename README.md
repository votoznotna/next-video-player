# YouTube-like Video Player with Frame Preview

A professional video analysis platform featuring a YouTube-like player with frame preview on timeline hover, video chunking, and advanced video streaming capabilities. Built with React 19, Next.js 15, FastAPI, and PostgreSQL.

## 🎬 Demo

![YouTube-like Video Player Demo](video-player-demo.gif)

_Timeline click selection, green interval highlighting, frame preview on hover, and smooth seeking_

## 🎉 Latest Updates (Current Version)

### ✅ **Fully Working YouTube-like Player**

- **Timeline Click Selection**: Click anywhere on timeline to select annotations
- **Green Interval Highlighting**: Visual feedback showing selected annotation intervals
- **Smooth Seeking**: Instant video seeking without shaking or freezing
- **Clean UI**: No red markers or visual artifacts
- **Stable Performance**: All selections work consistently after first click
- **WebM Support**: Optimized video format for web streaming
- **Range Request Streaming**: Efficient video delivery with HTTP range requests

## 🎯 Key Features

### YouTube-like Video Player

- **Frame Preview on Timeline Hover**: Hover over timeline to see frame previews with time and chunk info, just like YouTube
- **Timeline Click Selection**: Click anywhere on timeline to select corresponding annotations
- **Green Interval Highlighting**: Visual feedback showing selected annotation intervals (1st annotation = 1 green interval, 2nd = 2 intervals, etc.)
- **Video Chunking System**: Large videos automatically split into 2-minute chunks for efficient loading
- **Real-time Frame Counter**: Shows current frame number and timestamp
- **Smooth Timeline Navigation**: Click anywhere on timeline to seek instantly without shaking
- **WebM Video Support**: Optimized video format for web streaming with range requests
- **Custom Video Support**: Easy integration of your own video files

### Advanced Video Features

- **High-Speed Playback:** 0.25x to 8x speed for rapid video review (10 speed options)
- **Frame-Accurate Navigation:** Precise incident marking (±1 frame precision)
- **30+ Keyboard Shortcuts:** Keyboard-first workflow for maximum efficiency
- **Speed & Frame Indicators:** Real-time display of playback speed and frame number
- **Keyboard Help Overlay:** Press `?` to see all available shortcuts
- **Incident Annotation System:** 5 threat categories (Critical, Suspicious, Policy Violation, Note, Evidence)
- **Timeline Visualization:** Visual timeline with color-coded incident markers
- **Video Chunking**: Configurable chunking for large video files
- **Thumbnail Generation**: Automatic thumbnail sprites for timeline previews

### Technical Stack

- **Frontend:** React 19 + Next.js 15 + TypeScript + Zustand
- **Video Player:** HTML5 Video with Canvas-based frame preview + Range Request Streaming
- **Video Format:** WebM (VP9) for optimal web streaming performance
- **UI Components:** Radix UI (accessible, headless components)
- **Backend:** FastAPI + Strawberry GraphQL
- **Video Processing:** FFmpeg for chunking and frame extraction
- **Database:** PostgreSQL 15 with video chunk metadata
- **Containerization:** Docker + Docker Compose
- **State Management:** Zustand (lightweight, no boilerplate)
- **Streaming:** HTTP Range Requests for efficient video delivery

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│   Frontend (Next.js 15 + React 19)                      │
│   ├── Enhanced VideoPlayer Component                    │
│   ├── Timeline with Canvas Rendering                    │
│   ├── Annotation Management                             │
│   └── Keyboard Shortcut System                          │
└─────────────────────────────────────────────────────────┘
                            ↓ GraphQL
┌─────────────────────────────────────────────────────────┐
│   Backend (FastAPI + Strawberry GraphQL)                │
│   ├── Video Management API                              │
│   ├── Annotation CRUD Operations                        │
│   ├── Export Service                                    │
│   └── PostgreSQL Database                               │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local backend development)
- FFmpeg (for video processing)

### One-Command Demo Setup

**Start the complete demo with frame preview:**

```bash
./scripts/start-demo.sh
```

This single command will:

- ✅ Check dependencies (Docker, FFmpeg)
- ✅ Clean up any existing setup
- ✅ Create animated demo video (30 minutes with colorful content)
- ✅ Start all services (Frontend, Backend, Database)
- ✅ Run database migrations
- ✅ Seed database with sample data
- ✅ Generate video chunks for efficient streaming
- ✅ Display access URLs and features

### Using Your Own Videos

**Quick Method - Replace Demo Video:**

```bash
# 1. Place your video in the videos folder
cp /path/to/your/video.mp4 videos/demo_video.mp4

# 2. Run the demo script (auto-chunks your video)
./scripts/start-demo.sh

# 3. Open browser and enjoy!
open http://localhost:3000
```

**Your video will be automatically:**

- ✅ **Chunked** into 2-minute segments for efficient loading
- ✅ **Metadata stored** in database with chunk information
- ✅ **Frame previews enabled** on timeline hover
- ✅ **YouTube-like features** ready to use

**Supported Video Formats:**

- **WebM** (VP9) - **Recommended** for web streaming (current default)
- **MP4** (H.264) - Good compatibility
- **MOV** (H.264) - Apple format

**Video Specifications:**

- **Resolution**: Any (1280x720 recommended)
- **Frame Rate**: 24-60 FPS
- **Duration**: Any length (will be chunked automatically)
- **Codec**: VP9 (WebM), H.264 (MP4), or VP8
- **Streaming**: HTTP Range Requests for efficient seeking

For detailed configuration options, see [docs/CUSTOM_VIDEO_GUIDE.md](docs/CUSTOM_VIDEO_GUIDE.md).

**Important:** Video files and chunks are automatically generated by the demo scripts and are excluded from git via `.gitignore`. This keeps the repository lightweight while allowing full functionality.

### Manual Setup (Alternative)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd video-player
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

   **Important:** This installs the video streaming libraries:
   - `hls.js` - HLS streaming support
   - `video.js` - Professional video player
   - `zustand` - State management
   - `@radix-ui/*` - UI components

3. **Start all services (Docker - Recommended)**

   ```bash
   ./scripts/start.sh dev
   ```

   Wait ~15 seconds for services to initialize.

4. **Seed the database with sample data**

   ```bash
   ./scripts/seed.sh
   ```

5. **Generate HLS streams (for HLS player)**

   ```bash
   # Generate HLS streams with adaptive bitrate
   curl -X POST http://localhost:8000/api/v1/videos/{video_id}/hls/generate
   ```

6. **Access the application**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8000
   - **GraphQL Playground:** http://localhost:8000/graphql
   - **API Docs:** http://localhost:8000/docs
   - **Database:** localhost:5432

### Configuration Options

**Use HLS streaming (recommended):**

```bash
USE_HLS=true ./scripts/start-demo.sh
```

**Use basic chunking:**

```bash
USE_HLS=false ./scripts/start-demo.sh
```

**Custom chunk duration:**

```bash
CHUNK_DURATION=60 ./scripts/start-demo.sh  # 1-minute chunks
```

## 🎮 Usage

### YouTube-like Video Player

The application features a professional YouTube-like video player with:

**Key Features:**

- **Frame Preview on Hover**: Hover over timeline to see frame previews
- **Timeline Click Selection**: Click anywhere on timeline to select annotations
- **Green Interval Highlighting**: Visual feedback showing selected annotation intervals
- **WebM Streaming**: Optimized video format with HTTP range requests
- **Smooth Seeking**: Instant seeking without shaking or freezing
- **Clean UI**: No red markers or visual artifacts

### Video Streaming Options

**WebM Streaming (Current Default):**

- HTTP Range Request streaming
- Optimized for web delivery
- Smooth seeking without shaking
- Efficient video loading
- Professional streaming performance

**HLS Streaming (Alternative):**

- Adaptive bitrate streaming
- Multiple quality levels (360p/720p/1080p)
- 10-second segments for fast seeking
- Professional streaming performance
- Mobile optimized

**Basic Chunking (Educational):**

- Configurable chunk duration (default: 2 minutes)
- Manual chunk management
- Good for learning and simple demos
- Full control over chunking logic

## 📁 Project Structure

```
video-player/
├── frontend/                 # Next.js 15 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   │   ├── YouTubeLikePlayer.tsx (main player with WebM streaming)
│   │   │   ├── HLSVideoPlayer.tsx (HLS streaming)
│   │   │   ├── SimpleSeekingPlayer.tsx (basic seeking)
│   │   │   ├── EnhancedVideoPlayer.tsx (legacy)
│   │   │   └── VideoCard.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useKeyboardShortcuts.ts
│   │   ├── store/          # Zustand stores
│   │   │   └── videoPlayerStore.ts
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript types
│   └── package.json
├── backend-fastapi/         # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   │   └── api_v1/endpoints/
│   │   │       ├── video_stream.py (WebM streaming with range requests)
│   │   │       ├── hls.py (HLS streaming)
│   │   │       ├── video_chunks.py (chunking)
│   │   │       └── videos.py
│   │   ├── services/       # Business logic
│   │   │   ├── hls_service.py (HLS generation)
│   │   │   ├── video_processing.py (chunking)
│   │   │   └── video_service.py
│   │   ├── models/         # Database models
│   │   │   ├── video_chunk.py (chunk metadata)
│   │   │   └── video.py
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # Application entry
│   ├── requirements.txt
│   └── seed.py             # Database seeding
├── scripts/                # Management scripts
│   ├── start-demo.sh      # Complete demo setup
│   ├── demo-setup.sh      # Advanced demo setup
│   ├── start.sh           # Start all services
│   ├── stop.sh            # Stop all services
│   ├── seed.sh            # Seed database
│   └── clean.sh           # Clean everything
├── videos/                 # Video storage (gitignored - generated by scripts)
│   ├── demo_video.webm    # Main demo video (WebM format)
│   ├── hls/               # HLS streams (generated)
│   ├── chunks/            # Video chunks (MP4 for frame extraction, generated)
│   └── thumbnails/        # Generated thumbnails
├── docker-compose.dev.yml  # Development config
├── docker-compose.yml      # Production config
└── README.md
```

## 🎬 Demo Scripts

### Complete Demo Setup

**One-command demo with HLS streaming:**

```bash
./scripts/start-demo.sh
```

**What this script does:**

1. ✅ Checks dependencies (Docker, FFmpeg)
2. ✅ Cleans up existing setup
3. ✅ Creates 30-minute animated demo video (WebM format)
4. ✅ Starts all services (Frontend, Backend, Database)
5. ✅ Runs database migrations
6. ✅ Seeds database with sample data
7. ✅ Generates video chunks for frame extraction
8. ✅ Displays access URLs and features

### Advanced Demo Setup

**For more control and configuration:**

```bash
./scripts/demo-setup.sh
```

**Configuration options:**

```bash
# Use WebM streaming (current default)
./scripts/start-demo.sh

# Use HLS streaming (alternative)
USE_HLS=true ./scripts/start-demo.sh

# Use basic chunking (educational)
USE_HLS=false ./scripts/start-demo.sh

# Custom chunk duration
CHUNK_DURATION=60 ./scripts/start-demo.sh  # 1-minute chunks
CHUNK_DURATION=300 ./scripts/start-demo.sh # 5-minute chunks
```

### Demo Features

**WebM Streaming Demo (Current Default):**

- HTTP Range Request streaming
- Smooth seeking without shaking
- Timeline click selection for annotations
- Green interval highlighting
- Frame preview on hover
- Professional streaming performance

**HLS Streaming Demo (Alternative):**

- Adaptive bitrate streaming (360p/720p/1080p)
- Quality selector in video player
- 10-second segments for fast seeking
- Thumbnail sprites for timeline previews
- Professional streaming performance

**Basic Chunking Demo (Educational):**

- Configurable chunk duration
- Manual chunk management
- Frame preview generation
- Educational approach to video streaming

## 🎮 Usage

### YouTube-like Video Player

The application features a professional YouTube-like video player with:

**Key Features:**

- 10 playback speeds (0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x, 4x, 8x)
- Frame-by-frame navigation (forward/backward)
- Real-time speed and frame indicators
- Interactive keyboard help (press `?`)
- Auto-hide controls
- Annotation markers on timeline
- Go to timestamp dialog

### Keyboard Shortcuts

**Press `?` in the video player to see all shortcuts!**

**Playback Control:**

- `Space` or `K` - Play/Pause
- `J` - Rewind 10 seconds
- `L` - Forward 10 seconds
- `←` - Seek backward 5 seconds
- `→` - Seek forward 5 seconds
- `Shift + ←` - Seek backward 30 seconds
- `Shift + →` - Seek forward 30 seconds
- `Home` - Jump to start
- `End` - Jump to end

**Speed Control:**

- `[` - Decrease speed
- `]` - Increase speed
- Click speed indicator to select from menu

**Frame Control:**

- `,` (comma) - Previous frame
- `.` (period) - Next frame

**Volume:**

- `↑` - Volume up
- `↓` - Volume down
- `M` - Mute/Unmute

**View:**

- `F` - Fullscreen
- `G` - Go to timestamp (opens dialog)
- `?` - Show keyboard shortcuts help

**Annotations:**

- `Shift + M` - Mark current position (opens dialog)
- `1` - Quick mark: Critical Incident
- `2` - Quick mark: Suspicious Activity
- `3` - Quick mark: Policy Violation
- `4` - Quick mark: Note
- `5` - Quick mark: Evidence Marker

## 📊 Implementation Status

### ✅ Phase 1: Core Enhancements (COMPLETE)

- ✅ Enhanced video player with 10 playback speeds
- ✅ Frame-by-frame navigation (±1 frame precision)
- ✅ 30+ keyboard shortcuts
- ✅ Speed and frame indicators
- ✅ Keyboard help overlay
- ✅ Zustand state management
- ✅ Auto-hide controls
- ✅ Annotation markers on timeline

### 🔄 Phase 2: Annotation System (Next)

- ⏳ Annotation dialog component
- ⏳ Annotation panel with filtering
- ⏳ GraphQL integration for CRUD
- ⏳ Annotation search functionality

### 📋 Phase 3: Timeline Enhancement (Planned)

- ⏳ Canvas-based timeline with Konva
- ⏳ Zoom functionality (10 levels)
- ⏳ Thumbnail preview on hover
- ⏳ Heatmap visualization

### 📋 Phase 4: Export Functionality (Planned)

- ⏳ Export dialog component
- ⏳ FFmpeg integration
- ⏳ Progress tracking
- ⏳ Watermarking support

### 📋 Phase 5: Multi-Video Support (Planned)

- ⏳ Grid layout (2x2, 2x1)
- ⏳ Synchronized playback
- ⏳ Shared timeline view
- ⏳ Independent controls

**Overall Progress:** 20% complete (Phase 1 of 5)

### Creating Annotations

**Current:** Click on timeline to mark incidents (basic functionality)

**Coming in Phase 2:**

1. Press `Shift + M` or `1-5` for quick marks
2. Fill in annotation dialog (type, severity, description)
3. Add tags for categorization
4. Save and see on timeline

### Exporting Evidence Clips

**Coming in Phase 4:**

1. Select time range on timeline
2. Click "Export Clip" button
3. Configure quality and format
4. Add watermark with case number
5. Download when processing complete

## 🔧 Development

### Available Scripts

```bash
# Docker Management
./scripts/start.sh dev      # Start in development mode
./scripts/start.sh          # Start in production mode
./scripts/stop.sh           # Stop all services
./scripts/clean.sh          # Clean up everything
./scripts/seed.sh           # Seed database

# Manual Development
npm run dev                 # Start both frontend and backend
npm run dev:frontend        # Start only frontend
npm run dev:backend         # Start only backend

# Building
npm run build               # Build frontend
npm run build:frontend      # Build frontend only
```

### Environment Variables

**Backend (.env in backend-fastapi/):**

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/insider_threat
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env.local in frontend/):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
NEXT_PUBLIC_VIDEO_URL=http://localhost:8000
```

## 🐳 Docker

### Services

- **postgres**: PostgreSQL 15 database
- **backend**: FastAPI with GraphQL
- **frontend**: Next.js application

### Commands

```bash
# Start all services (development)
./scripts/start.sh dev

# Start all services (production)
./scripts/start.sh

# Stop all services
./scripts/stop.sh

# Clean up everything (removes volumes)
./scripts/clean.sh

# Seed database
./scripts/seed.sh

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

## 📊 Database Schema

### Videos Table

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  filename VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  duration FLOAT NOT NULL,
  fps INTEGER DEFAULT 30,
  case_id VARCHAR(100),
  source_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Annotations Table

```sql
CREATE TABLE annotations (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  start_time FLOAT NOT NULL,
  end_time FLOAT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  severity VARCHAR(20),
  tags TEXT[],
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Documentation

### WebM Streaming API (Current Default)

**Stream Video with Range Requests:**

```bash
GET /api/v1/videos/{video_id}/stream
```

**Get Frame Preview:**

```bash
GET /api/v1/videos/{video_id}/frame/{time_seconds}
```

### HLS Streaming API (Alternative)

**Get HLS Master Playlist:**

```bash
GET /api/v1/videos/{video_id}/hls/playlist.m3u8
```

**Get Quality-Specific Playlist:**

```bash
GET /api/v1/videos/{video_id}/hls/{quality}/playlist.m3u8
```

**Get HLS Segment:**

```bash
GET /api/v1/videos/{video_id}/hls/{quality}/{segment}
```

**Get Timeline Thumbnail:**

```bash
GET /api/v1/videos/{video_id}/hls/thumbnails/{timestamp}.jpg
```

**Generate HLS Stream:**

```bash
POST /api/v1/videos/{video_id}/hls/generate
```

### Video Chunking API

**Get Video Chunks:**

```bash
GET /api/v1/videos/{video_id}/chunks
```

**Get Specific Chunk:**

```bash
GET /api/v1/videos/{video_id}/chunks/{chunk_id}
```

**Stream Video Chunk:**

```bash
GET /api/v1/videos/{video_id}/chunks/{chunk_id}/stream
```

### GraphQL API

**Get All Videos:**

```graphql
query GetVideos {
  videos {
    id
    title
    duration
    caseId
    annotations {
      id
      title
      type
      severity
      startTime
      endTime
    }
  }
}
```

**Create Annotation:**

```graphql
mutation CreateAnnotation($input: CreateAnnotationInput!) {
  createAnnotation(input: $input) {
    id
    title
    type
    severity
    startTime
    endTime
  }
}
```

## 🚨 Troubleshooting

### WebM Streaming Issues

**Video doesn't load with WebM:**

```bash
# Check if video stream endpoint works
curl -I http://localhost:8000/api/v1/videos/{video_id}/stream

# Check if video file exists
ls -la videos/demo_video.webm
```

**Seeking issues with WebM:**

- Ensure video has proper keyframes for seeking
- Check if range requests are supported
- Try refreshing the page

**Fallback to HLS streaming:**

```bash
USE_HLS=true ./scripts/start-demo.sh
```

### HLS Streaming Issues (Alternative)

**Video doesn't load with HLS:**

```bash
# Check if HLS stream exists
curl http://localhost:8000/api/v1/videos/{video_id}/hls/playlist.m3u8

# Generate HLS stream if missing
curl -X POST http://localhost:8000/api/v1/videos/{video_id}/hls/generate
```

**HLS quality selector not showing:**

- Ensure HLS stream has multiple quality levels
- Check browser console for HLS.js errors
- Try refreshing the page

**Fallback to basic chunking:**

```bash
USE_HLS=false ./scripts/start-demo.sh
```

### Video Processing Issues

**FFmpeg not found:**

```bash
# Install FFmpeg
brew install ffmpeg  # macOS
apt install ffmpeg   # Ubuntu
```

**Video chunking fails:**

- Check if video file exists in `backend-fastapi/videos/`
- Verify FFmpeg can read the video file
- Check database connection

**Frame previews not loading:**

- Ensure video chunks exist
- Check if thumbnail generation completed
- Verify API endpoints are accessible
- Check WebM video format compatibility

### TypeScript/Lint Errors

**HLS Video Player errors:**

```bash
cd frontend
npm install
```

**Missing dependencies:**

```bash
npm install hls.js video.js @types/video.js
```

**WebM Player errors:**

- Check if WebM format is supported in browser
- Verify video streaming endpoint is accessible
- Check console for range request errors

### Port Conflicts

If ports 3000, 8000, or 5432 are already in use:

```bash
# Kill processes on project ports
./scripts/kill-ports.sh

# Or stop all services
./scripts/stop.sh
```

### Database Connection Issues

1. **Check if services are running:**

   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

2. **Restart services:**

   ```bash
   ./scripts/stop.sh
   ./scripts/start.sh dev
   ```

3. **Check database logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs postgres
   ```

### Frontend Won't Start

If frontend fails to start:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Complete Reset

To completely reset the project:

```bash
# Stop everything and clean up
./scripts/clean.sh

# Start fresh
./scripts/start.sh dev

# Reinstall frontend dependencies
cd frontend && npm install && cd ..

# Seed with sample data
./scripts/seed.sh
```

## 📝 License

This project is licensed under the MIT License.

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Get started in 3 steps
- **[docs/CUSTOM_VIDEO_GUIDE.md](docs/CUSTOM_VIDEO_GUIDE.md)** - How to use your own videos
- **[docs/YOUTUBE_LIKE_PLAYER_GUIDE.md](docs/YOUTUBE_LIKE_PLAYER_GUIDE.md)** - YouTube-like features guide
- **[docs/VIDEO_STREAMING_COMPARISON.md](docs/VIDEO_STREAMING_COMPARISON.md)** - Streaming technology comparison
- **[docs/VIDEO_STORAGE_GUIDE.md](docs/VIDEO_STORAGE_GUIDE.md)** - Best practices for video storage and scaling
- **[docs/IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md)** - Technical implementation details
- **[docs/INSIDER_THREAT_VIDEO_LIBRARY_SPEC.md](docs/INSIDER_THREAT_VIDEO_LIBRARY_SPEC.md)** - Complete functional specification

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the GraphQL playground at http://localhost:8000/graphql
- Review the API docs at http://localhost:8000/docs
- Read the documentation files listed above

## 🔮 Roadmap

### Phase 2: Annotation System (Next - 2 weeks)

- [ ] Annotation dialog component
- [ ] Annotation panel with filtering
- [ ] GraphQL CRUD integration
- [ ] Annotation search

### Phase 3: Timeline Enhancement (4 weeks)

- [ ] Canvas-based timeline with Konva
- [ ] Zoom functionality (10 levels)
- [ ] Thumbnail preview on hover
- [ ] Heatmap visualization

### Phase 4: Export Functionality (3 weeks)

- [ ] Export dialog component
- [ ] FFmpeg integration
- [ ] Progress tracking
- [ ] Watermarking support

### Phase 5: Multi-Video Support (4 weeks)

- [ ] Grid layout (2x2, 2x1)
- [ ] Synchronized playback
- [ ] Shared timeline view
- [ ] Independent controls

### Future Enhancements

- [ ] AI-assisted incident detection
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

---

## 🎉 Project Status

**Phase 1 Complete!** The enhanced video player is ready with:

- ✅ 10 playback speeds (0.25x - 8x)
- ✅ Frame-by-frame navigation
- ✅ 30+ keyboard shortcuts
- ✅ Speed & frame indicators
- ✅ Keyboard help overlay
- ✅ Zustand state management
- ✅ Auto-hide controls

**Next:** Phase 2 - Annotation System (2 weeks)

**Overall Progress:** 20% complete (Phase 1 of 5)

---

## 🎉 Project Summary

**YouTube-like Video Player with WebM Streaming** - A professional video analysis platform featuring:

### ✅ **Completed Features**

- **WebM Streaming**: HTTP Range Request streaming with smooth seeking
- **YouTube-like Player**: Frame preview on timeline hover, timeline click selection
- **Green Interval Highlighting**: Visual feedback for annotation selection
- **Video Chunking**: Configurable chunking for large video files
- **Professional Streaming**: Efficient video delivery without shaking
- **Frame-accurate Navigation**: Precise video analysis capabilities
- **30+ Keyboard Shortcuts**: Professional video analysis workflow
- **Annotation System**: Timeline click selection with visual feedback
- **Multiple Streaming Options**: WebM (current default), HLS, and basic chunking
- **Clean UI**: No red markers or visual artifacts

### 🚀 **Quick Start**

```bash
# One-command demo setup
./scripts/start-demo.sh

# Access the application
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

### 🔧 **Configuration**

```bash
# WebM streaming (current default)
./scripts/start-demo.sh

# HLS streaming (alternative)
USE_HLS=true ./scripts/start-demo.sh

# Basic chunking (educational)
USE_HLS=false ./scripts/start-demo.sh

# Custom chunk duration
CHUNK_DURATION=60 ./scripts/start-demo.sh
```

### 📚 **Documentation**

- **YOUTUBE_LIKE_PLAYER_GUIDE.md** - Complete feature guide
- **VIDEO_STREAMING_COMPARISON.md** - HLS vs Basic chunking comparison
- **API Documentation** - Complete API reference

---

**Built for professional video analysis and streaming**  
**Tech Stack:** React 19 + Next.js 15 + FastAPI + WebM + PostgreSQL  
**Focus:** YouTube-like experience, smooth seeking, timeline click selection, frame-accurate analysis
