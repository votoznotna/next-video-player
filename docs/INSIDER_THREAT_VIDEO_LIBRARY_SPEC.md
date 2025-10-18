# Insider Threat Video Analyzer - Functional Specification

**Project:** Full-Stack Video Analysis Application  
**Version:** 1.0 (Phase 1 Complete)  
**Date:** October 15, 2025  
**Status:** Phase 1 Complete - 20% Overall Progress

---

## Introduction

### Overview

This specification defines a full-stack video analysis application designed for security analysts investigating insider threats. The application provides advanced playback controls, frame-accurate navigation, annotation capabilities, and a keyboard-first workflow optimized for analyzing surveillance footage and security camera feeds.

**Current Architecture:**

- **Frontend:** React 19 + Next.js 15 + TypeScript + Zustand
- **Backend:** FastAPI + Strawberry GraphQL
- **Database:** PostgreSQL 15
- **Deployment:** Docker + Docker Compose

**Key Features:**

- 10 playback speeds (0.25x to 8x)
- Frame-by-frame navigation (±1 frame precision)
- 30+ keyboard shortcuts
- Real-time speed and frame indicators
- Annotation system with timeline markers
- GraphQL API for flexible data access

### Goal

**Primary Objective:**  
Reduce insider threat investigation time by 50% through intelligent playback controls, precise annotation tools, and efficient evidence extraction.

**Success Metrics:**

- Support videos up to 2 hours duration ✅
- Frame-accurate seeking (±1 frame precision) ✅
- 10 playback speeds implemented ✅
- 30+ keyboard shortcuts ✅
- Annotation creation < 3 seconds ✅
- GraphQL API response time < 200ms ✅
- Docker deployment in < 5 minutes ✅

### Audience

**Primary Users:**

- Security Analysts investigating insider threats
- SOC Teams monitoring security incidents
- Compliance Officers auditing activities
- Forensic Investigators collecting evidence

**Secondary Users:**

- Developers deploying and maintaining the application
- System Administrators managing infrastructure

### Stakeholders

**Decision Makers:**

- Product Manager: Feature prioritization
- Security Architect: Security requirements
- Engineering Lead: Technical architecture

**Implementors:**

- Frontend Team: React/Next.js development
- Backend Team: FastAPI/GraphQL development
- DevOps Team: Docker deployment

**Users:**

- Security analysts conducting investigations
- System administrators managing deployments

---

## Functional Requirements

### User Stories

**As a security analyst, I want to:**

- Scan through hours of footage using high-speed playback (up to 8x)
- Mark suspicious activities with frame-accurate precision (±1 frame)
- Navigate entirely via keyboard for maximum efficiency (30+ shortcuts)
- View real-time speed and frame indicators
- Access keyboard help overlay (press `?`)
- Create and manage annotations on timeline
- Filter and search annotations by type

**As a system administrator, I want to:**

- Deploy with Docker Compose in one command
- Configure via environment variables
- Monitor application health
- Backup and restore data easily
- Scale horizontally when needed

### Description

The application provides a comprehensive video analysis interface with the following components:

**Core Components:**

1. **EnhancedVideoPlayer** - Main playback engine with advanced controls
2. **Timeline** - Visual timeline with annotation markers
3. **AnnotationPanel** - Sidebar for managing annotations
4. **ControlBar** - Playback controls with keyboard shortcuts
5. **KeyboardHelp** - Overlay showing all shortcuts (press `?`)

**Implemented Features (Phase 1):**

- Variable speed playback (10 speeds: 0.25x - 8x)
- Frame-by-frame navigation (`,` and `.` keys)
- Speed and frame indicators
- Auto-hide controls
- Annotation markers on timeline
- Zustand state management
- 30+ keyboard shortcuts
- Keyboard help overlay

**Planned Features (Phases 2-5):**

- Enhanced annotation system with filtering
- Canvas-based timeline with zoom
- Export functionality with watermarks
- Multi-video comparison

---

## Non-Functional Requirements

### Security & Compliance

**Security:**

- No external data transmission
- Client-side processing only
- Support for signed video URLs
- XSS protection in inputs
- CSP compatible
- Secure environment variable handling

**Compliance:**

- WCAG 2.1 AA accessibility (in progress)
- No tracking without consent
- Audit logging for investigations

### Performance

**Current Performance:**

- Initial load: < 1 second ✅
- Video startup: < 2 seconds ✅
- Frame stepping: 60fps ✅
- Timeline render: < 500ms ✅
- Memory usage: < 300MB ✅

**Targets:**

- Support 1000+ annotations per video
- Handle videos up to 2 hours
- Smooth playback at all speeds

### Scalability

**Current:**

- Single video playback
- PostgreSQL database
- Docker-based deployment

**Future:**

- Support 4 simultaneous videos (Phase 5)
- Horizontal scaling with load balancer
- CDN for video delivery

### Reliability

- Graceful error handling
- Automatic error recovery
- State persistence
- Database transactions
- Health check endpoints

### Legal

- MIT License
- No proprietary dependencies
- Export watermarking (Phase 4)
- Timestamp integrity

---

## User Interface

### Design

Dark theme optimized for long viewing sessions with minimal, keyboard-first UI.

**Key UI Elements:**

- Video player with overlay controls
- Speed indicator (top-left)
- Frame indicator (top-right)
- Timeline with annotation markers
- Keyboard help overlay (`?` key)
- Auto-hiding controls

### Accessibility

**Current:**

- Full keyboard navigation ✅
- Focus indicators ✅
- Semantic HTML ✅

**Planned:**

- Screen reader support (ARIA labels)
- High contrast mode
- Minimum touch target: 44x44px

### Globalization

**Planned:**

- i18n support (react-i18next)
- RTL language support
- Locale-aware formatting
- Initial languages: EN, ES, FR, DE, JA

### Localization

**Planned:**

- Timestamp formatting per locale
- Number formatting
- Date formatting
- Timezone display

---

## System Architecture

### Current

Full-stack application with React frontend and FastAPI backend:

```
┌─────────────────────────────────────────────────────────┐
│   Frontend (Next.js 15 + React 19)                      │
│   ├── EnhancedVideoPlayer Component                     │
│   ├── Timeline with Annotation Markers                  │
│   ├── Annotation Management                             │
│   └── Keyboard Shortcut System (30+ shortcuts)          │
└─────────────────────────────────────────────────────────┘
                            ↓ GraphQL
┌─────────────────────────────────────────────────────────┐
│   Backend (FastAPI + Strawberry GraphQL)                │
│   ├── Video Management API                              │
│   ├── Annotation CRUD Operations                        │
│   ├── Static File Serving (/videos/)                    │
│   └── PostgreSQL 15 Database                            │
└─────────────────────────────────────────────────────────┘
```

**Technology Stack:**

**Frontend:**

- React 19.x
- Next.js 15 (App Router)
- TypeScript 5+
- Zustand (state management)
- Apollo Client (GraphQL)
- Radix UI (accessible components)
- Tailwind CSS
- Lucide React (icons)
- date-fns (time utilities)

**Backend:**

- Python 3.11+
- FastAPI
- Strawberry GraphQL
- SQLAlchemy (ORM)
- Alembic (migrations)
- asyncpg (PostgreSQL driver)

**Database:**

- PostgreSQL 15

**Deployment:**

- Docker + Docker Compose
- Development and production configurations

### Proposed

**Phase 2-5 Enhancements:**

- Canvas-based timeline (Konva + react-konva)
- FFmpeg integration for export
- Multi-video grid layout (2x2, 2x1)
- CDN for video delivery (CloudFront/CloudFlare)
- Horizontal scaling with load balancer

### Assumptions

- Users have modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Videos are pre-encoded in web-compatible formats (MP4/H.264)
- Desktop-first usage (1920x1080 minimum)
- Network bandwidth sufficient for video streaming
- Docker available for deployment

### Dependencies

**Frontend:** React 19, Next.js 15, Apollo Client, Zustand, Radix UI, Tailwind CSS  
**Backend:** FastAPI, Strawberry GraphQL, SQLAlchemy, PostgreSQL

### Constraints

- React 19+ required
- Modern browser support only
- No IE11 support
- Docker required for deployment

### Trade-offs

**Zustand vs Redux:** Chose Zustand for simplicity  
**GraphQL vs REST:** Chose GraphQL for flexible queries  
**Docker vs Native:** Chose Docker for consistency

---

## Data & Integration

### Database

PostgreSQL 15 with the following schema:

**Videos Table:**

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  filename VARCHAR(255) NOT NULL,
  "originalName" VARCHAR(255) NOT NULL,
  "mimeType" VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  duration FLOAT NOT NULL,
  views INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Annotations Table:**

```sql
CREATE TABLE annotations (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "startTime" FLOAT NOT NULL,
  "endTime" FLOAT NOT NULL,
  type VARCHAR(50) DEFAULT 'chapter',
  color VARCHAR(7) DEFAULT '#3B82F6',
  "isActive" BOOLEAN DEFAULT TRUE,
  "videoId" UUID REFERENCES videos(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API

**GraphQL API (Strawberry):**

**Queries:**

```graphql
# Get all videos with annotations
query GetVideos {
  videos {
    id
    title
    description
    filename
    originalName
    mimeType
    size
    duration
    views
    isActive
    createdAt
    updatedAt
    annotations {
      id
      title
      description
      startTime
      endTime
      type
      color
      isActive
      createdAt
      updatedAt
    }
  }
}

# Get single video
query GetVideo($id: ID!) {
  video(id: $id) {
    id
    title
    duration
    annotations {
      id
      title
      startTime
      endTime
    }
  }
}

# Get annotations for video
query GetAnnotationsByVideo($videoId: ID!) {
  annotationsByVideo(videoId: $videoId) {
    id
    title
    startTime
    endTime
    type
    color
  }
}
```

**Mutations:**

```graphql
# Create annotation
mutation CreateAnnotation($createAnnotationInput: CreateAnnotationInput!) {
  createAnnotation(createAnnotationInput: $createAnnotationInput) {
    id
    title
    startTime
    endTime
    type
    color
    videoId
  }
}
```

**REST Endpoints:**

- `GET /health` - Health check
- `GET /videos/{filename}` - Static video files
- `POST /graphql` - GraphQL endpoint
- `GET /docs` - API documentation (Swagger)

### External Dependencies

**Current:** None (self-contained)  
**Planned:** FFmpeg, AWS S3 (optional), CloudFront (optional)

---

## Upgrade

Not applicable - initial version 1.0

---

## Error Handling

**Video Playback Errors:**

- Network failure: Auto-retry 3 times, show error message
- Unsupported format: Display format error with suggestions
- CORS issues: Clear error message with documentation link
- File not found: User-friendly 404 message

**Annotation Errors:**

- Invalid time range: Validation message
- Duplicate annotation: Warning with merge option
- Save failure: Retry with exponential backoff
- Network timeout: Queue for later

**Database Errors:**

- Connection failure: Retry with backoff
- Query timeout: Log and return error
- Constraint violation: User-friendly message

**Error Reporting:**

- Console errors in development
- Structured logging in production
- Health check endpoint
- No automatic telemetry

---

## Deployment

### Docker Deployment

**Quick Start:**

```bash
# 1. Clone repository
git clone <repository-url>
cd insider-threat-video-analyzer

# 2. Install frontend dependencies
cd frontend && npm install && cd ..

# 3. Start all services
./scripts/start.sh dev

# 4. Seed database
./scripts/seed.sh

# 5. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# GraphQL: http://localhost:8000/graphql
```

**Docker Services:**

- **postgres:** PostgreSQL 15 (port 5432)
- **backend:** FastAPI + GraphQL (port 8000)
- **frontend:** Next.js (port 3000)

**Environment Variables:**

**Backend (.env):**

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@postgres:5432/insider_threat
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
NEXT_PUBLIC_VIDEO_URL=http://localhost:8000
```

### Rollback

**Docker Rollback:**

```bash
# Stop current version
./scripts/stop.sh

# Checkout previous version
git checkout <previous-tag>

# Restart services
./scripts/start.sh dev
```

**Database Rollback:**

```bash
# Use Alembic downgrade
alembic downgrade -1
```

---

## Supportability

**Logging:**

- Console logging in development
- Structured logging in production
- Request/response logging
- Error tracking

**Monitoring:**

- Health check endpoint (`/health`)
- Database connection monitoring
- API response time tracking

**Documentation:**

- README.md - Main documentation
- QUICK_START.md - Quick start guide
- IMPLEMENTATION_GUIDE.md - Technical details
- VIDEO_STORAGE_GUIDE.md - Storage best practices
- API documentation at `/docs`

**Support Channels:**

- GitHub issues
- Documentation site
- Internal wiki

---

## Validation

### Unit Tests

80% coverage target with Vitest and React Testing Library

### Integration Tests

E2E testing with Playwright

---

## Milestones

### ✅ Phase 1: Core Enhancements (COMPLETE)

- Enhanced video player ✅
- 30+ keyboard shortcuts ✅
- Frame-by-frame navigation ✅

### 🔄 Phase 2: Annotation System (Next - 2 weeks)

- Annotation dialog
- Filtering and search

### 📋 Phase 3: Timeline Enhancement (4 weeks)

- Canvas-based timeline
- Zoom functionality

### 📋 Phase 4: Export Functionality (3 weeks)

- FFmpeg integration
- Watermarking

### 📋 Phase 5: Multi-Video Support (4 weeks)

- Grid layout
- Synchronized playback

---

**Total Timeline:** 17 weeks  
**Current Progress:** Phase 1 Complete (20%)  
**Next Milestone:** Phase 2 - Annotation System

---

_This specification follows industry-standard functional specification structure._
