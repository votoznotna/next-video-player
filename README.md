# Demo Video Player - Security Footage Analysis

A professional video analysis platform featuring a YouTube-like player with frame preview on timeline hover, video chunking, and advanced video streaming capabilities. Built with React 19, Next.js 15, FastAPI, and PostgreSQL.

## 🎬 Demo

![YouTube-like Video Player Demo](production-video-player-demo.gif)

_Timeline click selection, green interval highlighting, frame preview on hover, and smooth seeking_

## 🎉 Latest Updates (Current Version)

### ✅ **Demo Video Player - Production-Ready Implementation**

**Current Implementation:**

- **Streamlined Interface**: Single page with "Demo (Video Player)" title
- **Security Footage Demo**: "Demo Security Footage - Case ABC-123" video
- **WebM Streaming**: Direct video streaming with HTTP Range Request support
- **5-Minute Video Chunks**: Production-ready chunking for NFS-stored video files
- **Seamless Chunk Transitions**: Automatic switching between video files during playback
- **Timeline Click Selection**: Click anywhere on timeline to select annotations
- **Green Interval Highlighting**: Visual feedback showing selected annotation intervals
- **Smooth Seeking**: Instant video seeking without shaking or freezing
- **Clean UI**: No navigation buttons or visual artifacts
- **Playback Speed Preservation**: Speed settings maintained across chunk transitions
- **Always-Visible Cursor**: White cursor remains visible during timeline hover
- **Add Annotation Button**: Prominent green button for creating new annotations
- **Delete Annotation Support**: Full CRUD operations with confirmation dialogs
- **Vertical Button Layout**: Delete button positioned below play button for better UX
- **Enhanced Annotation Management**: Complete annotation lifecycle with backend support

**Recommended Enhancements:**

- **HLS.js Support**: Available but not implemented (hls.js package installed)
- **Adaptive Bitrate**: Could be added for better mobile performance
- **Thumbnail Previews**: Backend HLS service available for timeline thumbnails
- **Multiple Quality Levels**: HLS infrastructure supports 360p/720p/1080p

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

### Production Video Player Features

**Current Implementation:**

- **WebM Streaming**: Direct video streaming with HTTP Range Request support
- **5-Minute Video Chunks**: Production-ready chunking for NFS-stored video files
- **Seamless Chunk Transitions**: Automatic switching between video files during playback
- **Production Database**: PostgreSQL stores chunk metadata with start/end times and file locations
- **NFS Integration**: Simulates Network File System storage for production environments
- **Case Management**: Support for case IDs and source type tracking
- **Chunk-based Timeline**: Timeline spans across multiple video chunks with accurate time mapping
- **Production Annotations**: Annotations work across chunk boundaries with global time references
- **Annotation CRUD Operations**: Create, read, update, and delete annotations with full backend support
- **Confirmation Dialogs**: Safe deletion with user confirmation prompts
- **Single Page Application**: Streamlined interface with no navigation clutter

**Available but Not Implemented:**

- **HLS Streaming**: Backend HLS service available with adaptive bitrate support
- **Multiple Quality Levels**: 360p, 720p, 1080p quality variants supported
- **Thumbnail Sprites**: Timeline thumbnail previews available via HLS service
- **10-Second Segments**: HLS segments for faster seeking (vs 5-minute chunks)

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

**Current Implementation:**

- **Frontend:** React 19 + Next.js 15 + TypeScript + Zustand
- **Video Player:** HTML5 Video with direct WebM streaming + HTTP Range Requests
- **Video Format:** WebM (VP9) for optimal web streaming performance
- **UI Components:** Radix UI (accessible, headless components)
- **Backend:** FastAPI + Strawberry GraphQL
- **Video Processing:** FFmpeg for chunking and frame extraction
- **Database:** PostgreSQL 15 with video chunk metadata
- **Containerization:** Docker + Docker Compose
- **State Management:** Zustand (lightweight, no boilerplate)
- **Streaming:** HTTP Range Requests for efficient video delivery

**Available but Not Used:**

- **HLS.js:** Installed but not implemented in production player
- **HLS Streaming:** Backend HLS service with adaptive bitrate support
- **Multiple Quality Levels:** 360p, 720p, 1080p variants available
- **Thumbnail Sprites:** Timeline preview system via HLS service

## 🏗️ Architecture

### Current Production Video Player Architecture

```
┌─────────────────────────────────────────────────────────┐
│   Frontend (Next.js 15 + React 19)                      │
│   ├── ProductionVideoPlayer Component                   │
│   │   ├── WebM Streaming with Range Requests            │
│   │   ├── 5-Minute Chunk Management                     │
│   │   ├── Timeline Click Selection                      │
│   │   └── Frame Preview on Hover                        │
│   ├── ProductionVideoPage Component                     │
│   ├── Annotation Management                             │
│   └── GraphQL Integration                               │
└─────────────────────────────────────────────────────────┘
                            ↓ GraphQL + HTTP Range Requests
┌─────────────────────────────────────────────────────────┐
│   Backend (FastAPI + Strawberry GraphQL)                │
│   ├── Production Video API (/api/v1/production/)        │
│   │   ├── HTTP Range Request Support                    │
│   │   └── WebM Chunk Streaming                          │
│   ├── GraphQL Schema (productionVideos query)           │
│   ├── Video Chunk Management                            │
│   ├── Annotation CRUD Operations                        │
│   └── PostgreSQL Database (chunks + annotations)        │
└─────────────────────────────────────────────────────────┘
```

### Available but Unused HLS Architecture

```
┌─────────────────────────────────────────────────────────┐
│   HLS Infrastructure (Available but Not Implemented)    │
│   ├── HLS Service (hls_service.py)                     │
│   │   ├── Adaptive Bitrate Streaming                    │
│   │   ├── Multiple Quality Levels (360p/720p/1080p)    │
│   │   ├── 10-Second Segments                           │
│   │   └── Thumbnail Sprite Generation                   │
│   ├── HLS API Endpoints (/api/v1/videos/{id}/hls/)     │
│   └── hls.js Package (Installed but Unused)            │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local backend development)
- FFmpeg (for video processing)

### One-Command Demo Setup

**Start the production demo with 5-minute WebM chunks (Recommended):**

```bash
./scripts/production-demo.sh
```

**Start the legacy demo with 2-minute chunks:**

```bash
./scripts/start-demo.sh
```

### Production Demo Script Features

The `production-demo.sh` script provides:

- ✅ **Dependency Check**: Docker, Docker Compose, FFmpeg
- ✅ **Clean Setup**: Removes existing containers and video files
- ✅ **Video Generation**: Creates 6 x 5-minute WebM chunks (30 minutes total)
- ✅ **Service Startup**: Frontend, Backend, PostgreSQL database
- ✅ **Database Setup**: Creates tables and seeds production data
- ✅ **Video Processing**: Generates WebM chunks with VP9 codec
- ✅ **Range Request Support**: HTTP 206 Partial Content for smooth seeking
- ✅ **Production Metadata**: Case ID, source type, chunk information
- ✅ **Annotation System**: 6 time-based annotations for demo

### Legacy Demo Script Features

The `start-demo.sh` script provides:

- ✅ **2-Minute Chunks**: Smaller chunks for educational purposes
- ✅ **MP4 Format**: H.264 codec for broader compatibility
- ✅ **Basic Streaming**: Simple chunk-based video delivery

### Using Your Own Videos

**Production Video Method (Recommended):**

```bash
# 1. Place your video in the production folder
cp /path/to/your/video.webm videos/production/your_video.webm

# 2. Update the production-demo.sh script to use your video
# Edit the script to reference your video file

# 3. Run the production demo script
./scripts/production-demo.sh

# 4. Open browser and enjoy!
open http://localhost:3000
```

**Legacy Method - Replace Demo Video:**

```bash
# 1. Place your video in the videos folder
cp /path/to/your/video.mp4 videos/demo_video.mp4

# 2. Run the legacy demo script (auto-chunks your video)
./scripts/start-demo.sh

# 3. Open browser and enjoy!
open http://localhost:3000
```

### Video Format Recommendations

**For Production Use (Current Implementation):**

- **WebM** (VP9) - **Recommended** for optimal web streaming
- **Resolution**: 1280x720 or higher
- **Frame Rate**: 25-30 FPS
- **Duration**: Any length (will be chunked into 5-minute segments)
- **Codec**: VP9 with keyframes every 10 seconds for smooth seeking

**For Legacy Demo:**

- **MP4** (H.264) - Good compatibility
- **Resolution**: Any (1280x720 recommended)
- **Frame Rate**: 24-60 FPS
- **Duration**: Any length (will be chunked into 2-minute segments)
- **Codec**: H.264 with frequent keyframes

### Video Processing Features

**Production Video Processing:**

- ✅ **5-Minute Chunks**: Production-ready segment size
- ✅ **WebM Format**: VP9 codec for optimal streaming
- ✅ **Range Request Support**: HTTP 206 Partial Content
- ✅ **Metadata Storage**: Chunk information in PostgreSQL
- ✅ **Case Management**: Support for case IDs and source types

**Legacy Video Processing:**

- ✅ **2-Minute Chunks**: Educational segment size
- ✅ **MP4 Format**: H.264 codec for broad compatibility
- ✅ **Basic Streaming**: Simple chunk-based delivery

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

**Production Demo (Current Default):**

```bash
# Uses WebM streaming with 5-minute chunks
./scripts/production-demo.sh
```

**Legacy Demo Options:**

```bash
# Use HLS streaming (available but not implemented in production player)
USE_HLS=true ./scripts/start-demo.sh

# Use basic chunking
USE_HLS=false ./scripts/start-demo.sh

# Custom chunk duration (legacy demo only)
CHUNK_DURATION=60 ./scripts/start-demo.sh  # 1-minute chunks
```

**Note:** The production video player currently uses WebM streaming with HTTP Range Requests. HLS streaming is available in the backend but not implemented in the production player frontend.

## 🎮 Usage

### Production Video Player

The application features a professional production video player with:

**Current Implementation:**

- **WebM Streaming**: Direct video streaming with HTTP Range Request support
- **5-Minute Chunks**: Production-ready chunking for NFS-stored video files
- **Seamless Chunk Transitions**: Automatic switching between video files
- **Timeline Click Selection**: Click anywhere on timeline to select annotations
- **Green Interval Highlighting**: Visual feedback showing selected annotation intervals
- **Frame Preview on Hover**: Hover over timeline to see frame previews
- **Smooth Seeking**: Instant seeking without shaking or freezing
- **Playback Speed Preservation**: Speed settings maintained across chunk transitions
- **Always-Visible Cursor**: White cursor remains visible during timeline hover
- **Clean UI**: No navigation buttons or visual artifacts

**Available but Not Implemented:**

- **HLS Streaming**: Backend HLS service available with adaptive bitrate
- **Multiple Quality Levels**: 360p, 720p, 1080p variants supported
- **Thumbnail Sprites**: Timeline thumbnail previews via HLS service
- **10-Second Segments**: HLS segments for faster seeking

### Video Streaming Options

**WebM Streaming (Current Production Implementation):**

- ✅ **HTTP Range Request streaming** with 206 Partial Content support
- ✅ **5-Minute Chunks** for production-ready video segments
- ✅ **VP9 Codec** optimized for web delivery
- ✅ **Smooth seeking** without shaking or freezing
- ✅ **Efficient video loading** with range requests
- ✅ **Professional streaming performance** for security footage analysis

**HLS Streaming (Available but Not Implemented):**

- ⚠️ **Backend HLS service available** but not used in production player
- ⚠️ **Adaptive bitrate streaming** with multiple quality levels
- ⚠️ **10-second segments** for faster seeking than 5-minute chunks
- ⚠️ **360p/720p/1080p quality levels** supported
- ⚠️ **Mobile optimized** streaming performance
- ⚠️ **Thumbnail sprites** for timeline previews

**Legacy Chunking (Educational):**

- ✅ **2-Minute chunks** for educational purposes
- ✅ **MP4 format** with H.264 codec
- ✅ **Basic streaming** without range request support
- ✅ **Good for learning** and simple demos

## 📁 Project Structure

```
video-player/
├── frontend/                 # Next.js 15 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   └── page.tsx     # Single demo page
│   │   ├── components/      # React components
│   │   │   ├── ProductionVideoPlayer.tsx (main demo player with WebM streaming)
│   │   │   ├── ProductionVideoPage.tsx (demo page component)
│   │   │   ├── AnnotationList.tsx (annotation sidebar)
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
│   │   │       ├── production_videos.py (WebM streaming with range requests)
│   │   │       ├── videos.py (video management)
│   │   │       └── annotations.py (annotation management)
│   │   ├── services/       # Business logic
│   │   │   ├── video_processing.py (chunking)
│   │   │   ├── video_service.py
│   │   │   └── annotation_service.py
│   │   ├── models/         # Database models
│   │   │   ├── video_chunk.py (chunk metadata)
│   │   │   ├── video.py
│   │   │   └── annotation.py
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # Application entry
│   ├── requirements.txt
│   └── seed.py             # Database seeding
├── scripts/                # Management scripts
│   ├── start-demo.sh      # Complete demo setup
│   ├── production-demo.sh # Demo with 5-minute chunks
│   ├── start.sh           # Start all services
│   ├── stop.sh            # Stop all services
│   ├── seed.sh            # Seed database
│   └── clean.sh           # Clean everything
├── videos/                 # Video storage (gitignored - generated by scripts)
│   ├── production/        # Production video chunks (WebM format)
│   │   ├── production_chunk_000.webm
│   │   ├── production_chunk_001.webm
│   │   └── ... (6 chunks total)
│   └── demo_video.webm    # Legacy demo video (WebM format)
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

### ✅ Phase 2: Annotation System (COMPLETE)

- ✅ Annotation dialog component (AddAnnotationForm)
- ✅ Annotation panel with filtering (AnnotationList)
- ✅ GraphQL integration for CRUD (CREATE, DELETE mutations)
- ✅ Add/Delete annotation functionality
- ✅ Confirmation dialogs for safe deletion
- ✅ Vertical button layout for better UX

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

**Overall Progress:** 40% complete (Phase 1 & 2 of 5)

### Creating Annotations

**Current Implementation:**

1. **Add Annotation Button**: Click the green "Add Annotation" button above the annotation list
2. **Annotation Form**: Fill in title, description, type, and timing in the modal dialog
3. **Current Time Integration**: Form automatically uses current video time as starting point
4. **Save and Display**: Annotation appears in the list with proper styling
5. **Timeline Integration**: Annotations work with timeline click selection

**Annotation Management:**

- **Create**: Green "Add Annotation" button with modal form
- **Read**: View all annotations in the right sidebar
- **Delete**: Red trash icon with confirmation dialog
- **Timeline Selection**: Click timeline to select corresponding annotations

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

### Production Video API (Current Implementation)

**Stream Video Chunk with Range Requests:**

```bash
GET /api/v1/production/{filename}
# Example: GET /api/v1/production/production_chunk_000.webm
# Returns: HTTP 206 Partial Content with range request support
```

**List Production Videos:**

```bash
GET /api/v1/production/
# Returns: List of available production video chunks
```

**Test Range Request Support:**

```bash
curl -v -H "Range: bytes=0-1023" http://localhost:8000/api/v1/production/production_chunk_000.webm
# Should return: HTTP/1.1 206 Partial Content
```

### HLS Streaming API (Available but Not Used in Production Player)

**Get HLS Master Playlist:**

```bash
GET /api/v1/videos/{video_id}/hls/playlist.m3u8
# Note: Not implemented in production video player frontend
```

**Get Quality-Specific Playlist:**

```bash
GET /api/v1/videos/{video_id}/hls/{quality}/playlist.m3u8
# Note: Backend supports 360p, 720p, 1080p quality levels
```

**Get HLS Segment:**

```bash
GET /api/v1/videos/{video_id}/hls/{quality}/{segment}
# Note: 10-second segments available but not used
```

**Get Timeline Thumbnail:**

```bash
GET /api/v1/videos/{video_id}/hls/thumbnails/{timestamp}.jpg
# Note: Thumbnail sprites available but not implemented
```

**Generate HLS Stream:**

```bash
POST /api/v1/videos/{video_id}/hls/generate
# Note: HLS service available but production player uses WebM streaming
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

**Get Production Videos:**

```graphql
query GetProductionVideos {
  productionVideos {
    id
    title
    duration
    totalDuration
    caseId
    sourceType
    isProduction
    chunks {
      id
      filename
      startTime
      endTime
      duration
      chunkIndex
    }
    annotations {
      id
      title
      type
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

### Production Video Streaming Issues

**Video doesn't load:**

```bash
# Check if production video endpoint works
curl -I http://localhost:8000/api/v1/production/production_chunk_000.webm

# Check if video files exist
ls -la videos/production/
```

**Seeking issues:**

- Ensure video has proper keyframes for seeking
- Check if range requests are supported (should return 206 Partial Content)
- Try refreshing the page

**Test range request support:**

```bash
curl -v -H "Range: bytes=0-1023" http://localhost:8000/api/v1/production/production_chunk_000.webm
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

**Demo Video Player - Security Footage Analysis** - A professional video analysis platform featuring:

### ✅ **Completed Features**

- **Single Page Application**: Streamlined "Demo (Video Player)" interface
- **Security Footage Demo**: "Demo Security Footage - Case ABC-123" video
- **WebM Streaming**: HTTP Range Request streaming with smooth seeking
- **YouTube-like Player**: Frame preview on timeline hover, timeline click selection
- **Green Interval Highlighting**: Visual feedback for annotation selection
- **5-Minute Video Chunks**: Production-ready chunking for large video files
- **Seamless Chunk Transitions**: Automatic switching between video files
- **Professional Streaming**: Efficient video delivery without shaking
- **Frame-accurate Navigation**: Precise video analysis capabilities
- **Playback Speed Preservation**: Speed settings maintained across chunk transitions
- **Always-Visible Cursor**: White cursor remains visible during timeline hover
- **Clean UI**: No navigation buttons or visual artifacts

### 🚀 **Quick Start**

```bash
# One-command demo setup with 5-minute chunks
./scripts/production-demo.sh

# Access the application
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

### 🔧 **Configuration**

```bash
# Production demo with WebM streaming and 5-minute chunks (current default)
./scripts/production-demo.sh

# Legacy demo with MP4 streaming and 2-minute chunks
./scripts/start-demo.sh

# HLS streaming (available but not implemented in production player)
USE_HLS=true ./scripts/start-demo.sh
```

### 📚 **Documentation**

- **YOUTUBE_LIKE_PLAYER_GUIDE.md** - Complete feature guide
- **VIDEO_STREAMING_COMPARISON.md** - HLS vs Basic chunking comparison
- **API Documentation** - Complete API reference

---

**Built for professional security footage analysis and streaming**  
**Tech Stack:** React 19 + Next.js 15 + FastAPI + WebM + PostgreSQL  
**Focus:** Demo video player, smooth seeking, timeline click selection, chunk-based streaming
