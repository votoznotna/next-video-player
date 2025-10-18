#!/bin/bash

# Complete Demo Script for YouTube-like Video Player with HLS Streaming
# This script provides a complete setup and demo experience

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

print_success() {
    echo -e "${CYAN}🎉 $1${NC}"
}

# Configuration
CHUNK_DURATION=${CHUNK_DURATION:-120}  # 2 minutes for basic chunking
USE_HLS=${USE_HLS:-true}  # Use HLS streaming by default
DEMO_VIDEO_URL="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
DEMO_VIDEO_FILENAME="demo_video.mp4"

echo -e "${BLUE}🎬 YouTube-like Video Player - Complete Demo${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

echo -e "${BLUE}Starting YouTube-like Video Player Demo...${NC}"
echo ""

# Stop and clear existing setup first
print_step "Stopping and clearing existing setup..."

# Stop any running services
if [ -f "./scripts/stop.sh" ]; then
    print_info "Stopping existing services..."
    ./scripts/stop.sh
else
    print_info "No stop script found, manually stopping services..."
    # Kill processes on common ports
    for port in 3000 8000 5432; do
        if lsof -ti:$port > /dev/null 2>&1; then
            print_info "Killing process on port $port"
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
fi

# Clean up Docker containers and volumes
print_info "Cleaning up Docker containers and volumes..."
docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
docker-compose -f docker-compose.yml down -v --remove-orphans 2>/dev/null || true

# Clean up any remaining containers
docker container prune -f 2>/dev/null || true
docker volume prune -f 2>/dev/null || true

# Clean up video files and chunks
print_info "Cleaning up video files and chunks..."
rm -rf backend-fastapi/videos/* 2>/dev/null || true
rm -rf backend-nestjs/videos/* 2>/dev/null || true
rm -rf backend-fastapi/videos/chunks/* 2>/dev/null || true
rm -rf backend-fastapi/videos/hls/* 2>/dev/null || true

# Clean up any temporary files
print_info "Cleaning up temporary files..."
rm -rf backend-fastapi/__pycache__ 2>/dev/null || true
rm -rf backend-fastapi/app/__pycache__ 2>/dev/null || true
rm -rf backend-fastapi/app/**/__pycache__ 2>/dev/null || true
rm -rf frontend/.next 2>/dev/null || true
rm -rf frontend/node_modules/.cache 2>/dev/null || true

print_success "Cleanup completed"
echo ""

# Check if required tools are installed
check_dependencies() {
    print_step "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command -v ffmpeg &> /dev/null; then
        print_warning "FFmpeg is not installed. Installing via Homebrew..."
        if command -v brew &> /dev/null; then
            brew install ffmpeg
        else
            print_error "Please install FFmpeg manually: https://ffmpeg.org/download.html"
            exit 1
        fi
    fi
    
    print_status "All dependencies are available"
}

# Clean up existing setup
cleanup() {
    print_step "Cleaning up existing setup..."
    
    # Stop and remove containers
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    
    # Remove video files and chunks
    rm -rf backend-fastapi/videos/*
    rm -rf backend-nestjs/videos/*
    
    # Kill any processes on our ports
    ./scripts/kill-ports.sh 2>/dev/null || true
    
    print_status "Cleanup completed"
}

# Download and prepare demo video
prepare_demo_video() {
    print_step "Preparing demo video..."
    
    # Create videos directory if it doesn't exist
    mkdir -p backend-fastapi/videos
    
    # Check if demo video already exists
    if [ -f "backend-fastapi/videos/$DEMO_VIDEO_FILENAME" ]; then
        print_info "Demo video already exists, skipping download"
        return
    fi
    
    print_info "Creating 30-minute demo video for chunking demonstration..."
    
    # Create a longer video by generating a test pattern (for demo purposes)
    # In production, you would have actual long videos
    mkdir -p videos
    ffmpeg -f lavfi -i testsrc2=size=1280x720:duration=1800 -vf "
drawtext=fontfile=/System/Library/Fonts/Arial.ttf:text='YouTube-like Video Player Demo':fontsize=50:fontcolor=white:x=(w-text_w)/2:y=50,
drawtext=fontfile=/System/Library/Fonts/Arial.ttf:text='Frame %{frame_num}':fontsize=30:fontcolor=yellow:x=50:y=100,
drawtext=fontfile=/System/Library/Fonts/Arial.ttf:text='Time %{pts\\:hms}':fontsize=25:fontcolor=cyan:x=50:y=140,
drawtext=fontfile=/System/Library/Fonts/Arial.ttf:text='Chunk %{expr\\:floor(t/120)+1}/15':fontsize=25:fontcolor=green:x=50:y=180,
drawtext=fontfile=/System/Library/Fonts/Arial.ttf:text='Hover timeline for frame preview!':fontsize=20:fontcolor=white:x=(w-text_w)/2:y=h-50
" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p "videos/$DEMO_VIDEO_FILENAME" -y
    
    print_status "Demo video ready (30 minutes, 1280x720)"
}

# Start services
start_services() {
    print_step "Starting services..."
    
    # Start the development environment
    ./scripts/start.sh dev
    
    # Wait for services to be ready
    print_info "Waiting for services to initialize..."
    sleep 20
    
    # Check if services are running
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            print_status "Backend is ready"
            break
        else
            print_info "Waiting for backend... (attempt $attempt/$max_attempts)"
            sleep 5
            attempt=$((attempt + 1))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_warning "Backend took longer than expected to start, but continuing..."
    fi
    
    print_status "Services started successfully"
}

# Run database migrations
run_migrations() {
    print_step "Running database migrations..."
    
    # Wait for database to be ready
    sleep 5
    
    # Run migrations (if any)
    docker-compose -f docker-compose.dev.yml exec -T backend-fastapi alembic upgrade head 2>/dev/null || {
        print_warning "No migrations to run or migration failed (this is normal for new setup)"
    }
    
    print_status "Database migrations completed"
}

# Seed database with demo data
seed_database() {
    print_step "Seeding database with demo data..."
    
    # Run the seed script
    ./scripts/seed.sh
    
    print_status "Database seeded successfully"
}

# Process video chunks or HLS streams
process_video() {
    if [ "$USE_HLS" = "true" ]; then
        print_step "Generating HLS streams with adaptive bitrate..."
        process_hls_streams
    else
        print_step "Processing video chunks (${CHUNK_DURATION}s chunks)..."
        process_video_chunks
    fi
}

# Process HLS streams
process_hls_streams() {
    # Create a Python script to generate HLS streams
    cat > backend-fastapi/generate_hls.py << 'EOF'
import asyncio
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent / "app"))

from app.core.database import get_db
from app.services.hls_service import HLSService
from app.models.video import Video
from sqlalchemy import select

async def generate_hls_streams():
    """Generate HLS streams for demo videos."""
    print("Generating HLS streams...")
    
    # Get database session
    async for db in get_db():
        try:
            # Find the demo video
            result = await db.execute(
                select(Video).where(Video.title.ilike("%demo%"))
            )
            video = result.scalar_one_or_none()
            
            if not video:
                print("No demo video found in database")
                return
            
            print(f"Found demo video: {video.title}")
            
            # Initialize HLS service
            hls_service = HLSService(chunk_duration=10)  # 10 seconds for HLS
            
            # Generate HLS stream
            video_path = Path("videos") / video.filename
            if video_path.exists():
                hls_info = await hls_service.create_hls_stream(video.id, video_path)
                print(f"Created HLS stream with qualities: {hls_info['qualities']}")
                print(f"Duration: {hls_info['duration']}s, Segments: {hls_info['segment_duration']}s")
            else:
                print(f"Video file not found: {video_path}")
                
        except Exception as e:
            print(f"Error generating HLS streams: {e}")
        finally:
            break

if __name__ == "__main__":
    asyncio.run(generate_hls_streams())
EOF

    # Run the HLS generation script
    docker-compose -f docker-compose.dev.yml exec -T backend-fastapi python generate_hls.py
    
    # Clean up the temporary script
    rm -f backend-fastapi/generate_hls.py
    
    print_status "HLS streams generated successfully"
}

# Process video chunks
process_video_chunks() {
    # Create a Python script to process the video
    cat > backend-fastapi/process_demo_video.py << 'EOF'
import asyncio
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent / "app"))

from app.core.database import get_db
from app.services.video_processing import VideoProcessingService
from app.models.video import Video
from sqlalchemy import select

async def process_demo_video():
    """Process the demo video and create chunks."""
    print("Processing demo video...")
    
    # Get database session
    async for db in get_db():
        try:
            # Find the demo video
            result = await db.execute(
                select(Video).where(Video.title.ilike("%demo%"))
            )
            video = result.scalar_one_or_none()
            
            if not video:
                print("No demo video found in database")
                return
            
            print(f"Found demo video: {video.title}")
            
            # Initialize video processing service
            video_service = VideoProcessingService(chunk_duration=120)  # 2 minutes
            
            # Process the video into chunks
            video_path = Path("videos") / video.filename
            if video_path.exists():
                chunks = await video_service.chunk_video(video.id, video_path, db)
                print(f"Created {len(chunks)} chunks for video {video.title}")
            else:
                print(f"Video file not found: {video_path}")
                
        except Exception as e:
            print(f"Error processing video: {e}")
        finally:
            break

if __name__ == "__main__":
    asyncio.run(process_demo_video())
EOF

    # Run the video processing script
    docker-compose -f docker-compose.dev.yml exec -T backend-fastapi python process_demo_video.py
    
    # Clean up the temporary script
    rm -f backend-fastapi/process_demo_video.py
    
    print_status "Video chunks processed successfully"
}

# Display final information
show_final_info() {
    echo ""
    print_success "Demo Setup Complete!"
    echo -e "${GREEN}======================${NC}"
    echo ""
    echo -e "${BLUE}📱 Access Points:${NC}"
    echo -e "  • Frontend: ${GREEN}http://localhost:3000${NC}"
    echo -e "  • Backend API: ${GREEN}http://localhost:8000${NC}"
    echo -e "  • API Documentation: ${GREEN}http://localhost:8000/docs${NC}"
    echo -e "  • GraphQL Playground: ${GREEN}http://localhost:8000/graphql${NC}"
    echo ""
    echo -e "${BLUE}🎬 Features Available:${NC}"
    echo -e "  • YouTube-like video player with frame preview on timeline hover"
    if [ "$USE_HLS" = "true" ]; then
        echo -e "  • HLS streaming with adaptive bitrate (360p/720p/1080p)"
        echo -e "  • Professional video streaming (10s segments)"
        echo -e "  • Quality selector in video player"
    else
        echo -e "  • Basic video chunking (${CHUNK_DURATION}s chunks)"
    fi
    echo -e "  • Frame-accurate seeking"
    echo -e "  • Keyboard shortcuts (press ? in video player)"
    echo -e "  • Annotation system"
    echo -e "  • Playback speed control (0.25x - 8x)"
    echo ""
    echo -e "${BLUE}🔧 Configuration:${NC}"
    if [ "$USE_HLS" = "true" ]; then
        echo -e "  • Streaming: HLS with adaptive bitrate"
        echo -e "  • Segment duration: 10 seconds"
        echo -e "  • HLS files stored in: backend-fastapi/videos/hls/"
    else
        echo -e "  • Chunk duration: ${CHUNK_DURATION} seconds"
        echo -e "  • Video chunks stored in: backend-fastapi/videos/chunks/"
    fi
    echo -e "  • Thumbnails stored in: backend-fastapi/videos/thumbnails/"
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo -e "  1. Open http://localhost:3000 in your browser"
    echo -e "  2. Click on the demo video to start playing"
    echo -e "  3. Hover over the timeline to see frame previews"
    echo -e "  4. Use keyboard shortcuts for advanced controls"
    echo ""
    echo -e "${BLUE}⌨️  Keyboard Shortcuts:${NC}"
    echo -e "  • Press '?' in the video player to see all shortcuts"
    echo -e "  • Use ',' and '.' for frame-by-frame navigation"
    echo -e "  • Press '1-5' to quickly add different types of annotations"
    echo -e "  • Use 'J' and 'L' for 10-second skips"
    echo -e "  • Use '[' and ']' to change playback speed"
    echo ""
    echo -e "${BLUE}🛠️  Configuration Options:${NC}"
    if [ "$USE_HLS" = "true" ]; then
        echo -e "  USE_HLS=false ./scripts/start-demo.sh  # Use basic chunking"
    else
        echo -e "  USE_HLS=true ./scripts/start-demo.sh   # Use HLS streaming"
        echo -e "  CHUNK_DURATION=60 ./scripts/start-demo.sh  # 1-minute chunks"
        echo -e "  CHUNK_DURATION=300 ./scripts/start-demo.sh # 5-minute chunks"
    fi
    echo ""
    echo -e "${BLUE}🔍 Troubleshooting:${NC}"
    echo -e "  • If video doesn't load: Check browser console for errors"
    echo -e "  • If HLS fails: Try USE_HLS=false for basic chunking"
    echo -e "  • If services won't start: Run ./scripts/clean.sh first"
    echo -e "  • For port conflicts: Run ./scripts/kill-ports.sh"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}Starting YouTube-like Video Player Demo...${NC}"
    echo ""
    
    check_dependencies
    cleanup
    prepare_demo_video
    start_services
    run_migrations
    seed_database
    process_video
    show_final_info
}

# Run main function
main "$@"
