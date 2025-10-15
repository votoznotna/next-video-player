# Insider Threat Video Analyzer

A professional React 19 video analysis library designed for security analysts investigating insider threats. Features frame-accurate navigation, high-speed playback, incident annotation, and evidence export capabilities.

## 🎯 Key Features

### For Security Analysts

- **High-Speed Playback:** 0.25x to 8x speed for rapid video review (10 speed options)
- **Frame-Accurate Navigation:** Precise incident marking (±1 frame precision)
- **30+ Keyboard Shortcuts:** Keyboard-first workflow for maximum efficiency
- **Speed & Frame Indicators:** Real-time display of playback speed and frame number
- **Keyboard Help Overlay:** Press `?` to see all available shortcuts
- **Incident Annotation System:** 5 threat categories (Critical, Suspicious, Policy Violation, Note, Evidence)
- **Timeline Visualization:** Visual timeline with color-coded incident markers
- **Evidence Export:** Extract clips with watermarks for reports (Phase 4)
- **Multi-Video Comparison:** Side-by-side analysis (Phase 5)

### Technical Stack

- **Frontend:** React 19 + Next.js 15 + TypeScript + Zustand
- **UI Components:** Radix UI (accessible, headless components)
- **Backend:** FastAPI + Strawberry GraphQL
- **Database:** PostgreSQL 15
- **Containerization:** Docker + Docker Compose
- **State Management:** Zustand (lightweight, no boilerplate)

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
- Python 3.11+ (for local development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd insider-threat-video-analyzer
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

   **Important:** This installs the new dependencies for the enhanced video player:

   - `zustand` - State management
   - `@radix-ui/*` - UI components
   - `date-fns` - Time utilities

3. **Start all services (Docker - Recommended)**

   ```bash
   ./scripts/start.sh dev
   ```

   Wait ~15 seconds for services to initialize.

4. **Seed the database with sample data**

   ```bash
   ./scripts/seed.sh
   ```

   **Note:** The database is automatically created by Docker when the postgres container starts for the first time.

5. **Access the application**

   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8000
   - **GraphQL Playground:** http://localhost:8000/graphql
   - **API Docs:** http://localhost:8000/docs
   - **Database:** localhost:5432

6. **Test the enhanced player**
   - Open a video
   - Press `?` to see all keyboard shortcuts
   - Try different playback speeds with `[` and `]`
   - Use `,` and `.` for frame-by-frame navigation

### Manual Setup (Alternative)

1. **Install dependencies**

   ```bash
   npm run setup
   ```

2. **Start database**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d postgres
   ```

3. **Start backend**

   ```bash
   cd backend-fastapi
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. **Start frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
insider-threat-video-analyzer/
├── frontend/                 # Next.js 15 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   │   ├── VideoPlayer.tsx (legacy)
│   │   │   ├── EnhancedVideoPlayer.tsx (new)
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
│   │   ├── api/            # GraphQL resolvers
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # Application entry
│   ├── requirements.txt
│   └── seed.py             # Database seeding
├── scripts/                # Management scripts
│   ├── start.sh           # Start all services
│   ├── stop.sh            # Stop all services
│   ├── seed.sh            # Seed database
│   └── clean.sh           # Clean everything
├── videos/                 # Video storage
├── docker-compose.dev.yml  # Development config
├── docker-compose.yml      # Production config
└── README.md
```

## 🎮 Usage

### Enhanced Video Player

The application now features an enhanced video player optimized for insider threat analysis:

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

## 🔌 GraphQL API

### Example Queries

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

### TypeScript/Lint Errors in EnhancedVideoPlayer

If you see TypeScript errors in `EnhancedVideoPlayer.tsx`:

**This is normal!** The errors occur because dependencies haven't been installed yet.

**Solution:**

```bash
cd frontend
npm install
```

All errors will disappear after installation.

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

Comprehensive documentation is available in the project root:

- **QUICK_START.md** - Get started in 3 steps
- **INSIDER_THREAT_VIDEO_LIBRARY_SPEC.md** - Complete functional specification
- **IMPLEMENTATION_GUIDE.md** - Technical implementation details
- **VIDEO_STORAGE_GUIDE.md** - Best practices for video storage and scaling

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

**Built for security analysts investigating insider threats**  
**Tech Stack:** React 19 + Next.js 15 + FastAPI + GraphQL + PostgreSQL  
**Focus:** Frame-accurate analysis, high-speed review, efficient workflow
