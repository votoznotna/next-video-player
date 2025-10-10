# Advanced Video Player

A professional video player application with advanced features including annotations, chapter navigation, and modern UI/UX. Built with Next.js 15, React 19, NestJS, GraphQL, and PostgreSQL.

## 🚀 Features

### Video Player

- **Advanced Controls**: Play/pause, seek, volume control, fullscreen
- **Chapter Navigation**: Click on annotations to jump to specific sections
- **Progress Visualization**: Visual markers for annotations on the progress bar
- **Keyboard Shortcuts**: Space for play/pause, arrow keys for seeking
- **Responsive Design**: Works on desktop and mobile devices

### Annotation System

- **Chapter Markers**: Create clickable chapters with custom colors
- **Time-based Navigation**: Jump to specific timestamps
- **Visual Indicators**: Color-coded annotations on the progress bar
- **Real-time Updates**: See current position within annotations
- **CRUD Operations**: Create, read, update, and delete annotations

### Backend Features

- **GraphQL API**: Type-safe API with introspection
- **Video Streaming**: Efficient video file serving
- **Database Management**: PostgreSQL with TypeORM
- **File Upload**: Support for video file uploads
- **Seeding**: Sample data for development

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React         │    │ • GraphQL       │    │ • Videos        │
│ • Apollo Client │    │ • TypeORM       │    │ • Annotations   │
│ • Tailwind CSS  │    │ • File Serving  │    │ • Relations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with improved performance
- **TypeScript** - Type safety and better DX
- **Apollo Client** - GraphQL client with caching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Backend

- **NestJS** - Scalable Node.js framework
- **GraphQL** - Type-safe API with Apollo Server
- **TypeORM** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Multer** - File upload handling

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **Scripts** - Automated setup and management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd video-player
   ```

2. **Start all services (Docker)**

   ```bash
   # Development mode (recommended)
   ./scripts/start.sh dev

   # Production mode
   ./scripts/start.sh
   ```

3. **Seed the database**

   ```bash
   # Using Docker (recommended)
   ./scripts/seed-docker.sh

   # Or using npm script
   npm run seed:docker
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend GraphQL: http://localhost:3001/graphql
   - Database: localhost:5432

### Manual Setup (Alternative)

1. **Install dependencies**

   ```bash
   npm run setup
   ```

2. **Start database**

   ```bash
   docker-compose up -d postgres
   ```

3. **Start backend**

   ```bash
   npm run dev:backend
   ```

4. **Start frontend**
   ```bash
   npm run dev:frontend
   ```

## 📁 Project Structure

```
video-player/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── video/          # Video module
│   │   ├── annotation/     # Annotation module
│   │   ├── app.module.ts   # Main app module
│   │   └── main.ts         # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and config
│   │   └── types/        # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── scripts/               # Management scripts
│   ├── start.sh          # Start all services
│   ├── stop.sh           # Stop all services + kill ports
│   ├── clean.sh          # Clean everything + kill ports
│   ├── kill-ports.sh     # Kill processes on project ports
│   ├── seed-docker.sh    # Seed database with sample data
│   ├── setup.sh          # Setup development environment
│   └── docker-test.sh    # Test Docker setup
├── docker-compose.yml    # Docker services
└── README.md
```

## 🎮 Usage

### Video Player Controls

- **Space** - Play/Pause
- **Left/Right Arrow** - Seek backward/forward 10 seconds
- **Up/Down Arrow** - Volume up/down
- **F** - Toggle fullscreen
- **M** - Mute/unmute

### Creating Annotations

1. Click "Add Annotation" button
2. Fill in the annotation details:
   - Title and description
   - Start and end times
   - Color and type
3. Click "Create" to save

### Navigation

- Click on annotation markers in the progress bar
- Use the annotation list in the sidebar
- Click the play button next to any annotation

## 🔧 Development

### Available Scripts

```bash
# Docker Management
./scripts/start.sh dev   # Start in development mode (recommended)
./scripts/start.sh       # Start in production mode
./scripts/stop.sh        # Stop all services and kill port processes
./scripts/clean.sh       # Clean up everything and kill port processes
./scripts/kill-ports.sh  # Kill processes on project ports only
./scripts/docker-test.sh # Test Docker setup

# Manual Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build both applications
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Database
npm run seed             # Seed database with sample data (local)
npm run seed:docker      # Seed database with sample data (Docker)
```

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/video_player
NODE_ENV=development
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/graphql
```

## 🐳 Docker

### Services

- **postgres**: PostgreSQL database
- **backend**: NestJS API server
- **frontend**: Next.js application

### Commands

```bash
# Start all services (development)
./scripts/start.sh dev

# Start all services (production)
./scripts/start.sh

# Stop all services and kill port processes
./scripts/stop.sh

# Clean up everything (removes volumes and kills ports)
./scripts/clean.sh

# Kill processes on project ports only
./scripts/kill-ports.sh

# Seed database with sample data
./scripts/seed-docker.sh

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Traditional Docker commands (alternative)
docker-compose up -d
docker-compose down
docker-compose down -v
```

### Enhanced Scripts

The project includes several enhanced scripts for better development experience:

#### **Port Management**

All scripts now include automatic port cleanup to prevent conflicts:

- **Port 3000**: Frontend (Next.js)
- **Port 3001**: Backend (NestJS)
- **Port 5432**: PostgreSQL Database

#### **Script Features**

| Script           | Purpose                    | Port Cleanup | Volume Cleanup |
| ---------------- | -------------------------- | ------------ | -------------- |
| `start.sh dev`   | Start development services | ❌           | ❌             |
| `start.sh`       | Start production services  | ❌           | ❌             |
| `stop.sh`        | Stop services              | ✅           | ❌             |
| `clean.sh`       | Clean everything           | ✅           | ✅             |
| `kill-ports.sh`  | Kill port processes only   | ✅           | ❌             |
| `seed-docker.sh` | Seed database              | ❌           | ❌             |

#### **Usage Examples**

```bash
# Start development environment
./scripts/start.sh dev

# Seed with sample data
./scripts/seed-docker.sh

# Stop and clean up
./scripts/stop.sh

# Complete cleanup (removes all data)
./scripts/clean.sh

# Just kill processes on ports (useful for troubleshooting)
./scripts/kill-ports.sh
```

## 📊 Database Schema

### Videos Table

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  filename VARCHAR NOT NULL,
  original_name VARCHAR NOT NULL,
  mime_type VARCHAR NOT NULL,
  size BIGINT NOT NULL,
  duration FLOAT NOT NULL,
  views BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Annotations Table

```sql
CREATE TABLE annotations (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  type VARCHAR DEFAULT 'chapter',
  color VARCHAR DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Reference

### GraphQL Queries

#### Get All Videos

```graphql
query GetVideos {
  videos {
    id
    title
    description
    filename
    duration
    views
    annotations {
      id
      title
      startTime
      endTime
      color
    }
  }
}
```

#### Get Video by ID

```graphql
query GetVideo($id: ID!) {
  video(id: $id) {
    id
    title
    description
    filename
    duration
    views
    annotations {
      id
      title
      description
      startTime
      endTime
      type
      color
    }
  }
}
```

#### Get Annotations by Video

```graphql
query GetAnnotationsByVideo($videoId: ID!) {
  annotationsByVideo(videoId: $videoId) {
    id
    title
    description
    startTime
    endTime
    type
    color
  }
}
```

### GraphQL Mutations

#### Create Annotation

```graphql
mutation CreateAnnotation($createAnnotationInput: CreateAnnotationInput!) {
  createAnnotation(createAnnotationInput: $createAnnotationInput) {
    id
    title
    description
    startTime
    endTime
    type
    color
  }
}
```

## 🚀 Deployment

### Production Build

```bash
# Build all services
npm run build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup

1. Set production environment variables
2. Configure reverse proxy (nginx)
3. Set up SSL certificates
4. Configure database backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the GraphQL playground at `/graphql`

## 🔮 Future Enhancements

- [ ] Video upload functionality
- [ ] User authentication and authorization
- [ ] Playlist management
- [ ] Video transcoding
- [ ] Analytics and viewing statistics
- [ ] Mobile app
- [ ] Real-time collaboration
- [ ] Video comments and discussions

## 🔧 Troubleshooting

### Port Conflicts

If you encounter port conflicts (ports 3000, 3001, or 5432 already in use):

```bash
# Kill processes on project ports only
./scripts/kill-ports.sh

# Or stop all services and kill ports
./scripts/stop.sh
```

### Database Connection Issues

If the backend can't connect to the database:

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

### Seeding Issues

If database seeding fails:

1. **Ensure services are running:**

   ```bash
   ./scripts/start.sh dev
   ```

2. **Wait for services to be ready (30-60 seconds)**

3. **Run seed script:**
   ```bash
   ./scripts/seed-docker.sh
   ```

### Complete Reset

To completely reset the project:

```bash
# Stop everything and clean up
./scripts/clean.sh

# Start fresh
./scripts/start.sh dev

# Seed with sample data
./scripts/seed-docker.sh
```
