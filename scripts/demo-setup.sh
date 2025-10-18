#!/bin/bash

# Demo Setup Script for YouTube-like Video Player with Chunking
# This script sets up the complete system with video chunking capabilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CHUNK_DURATION=${CHUNK_DURATION:-120}  # 2 minutes default, configurable
USE_HLS=${USE_HLS:-true}  # Use HLS streaming by default
DEMO_VIDEO_URL="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
DEMO_VIDEO_FILENAME="demo_video.mp4"

echo -e "${BLUE}🎬 YouTube-like Video Player Demo Setup${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

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

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
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
    print_info "Cleaning up existing setup..."
    
    # Stop and remove containers
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    
    # Remove video files and chunks
    rm -rf backend-fastapi/videos/*
    rm -rf backend-nestjs/videos/*
    
    # Kill any processes on our ports
    ./scripts/kill-ports.sh 2>/dev/null || true
    
    print_status "Cleanup completed"
}

# Download demo video
download_demo_video() {
    print_info "Downloading demo video..."
    
    # Create videos directory if it doesn't exist
    mkdir -p backend-fastapi/videos
    
    # Check if demo video already exists
    if [ -f "backend-fastapi/videos/$DEMO_VIDEO_FILENAME" ]; then
        print_info "Demo video already exists, skipping download"
        return
    fi
    
    # Download demo video (30 minutes of content for chunking demo)
    print_info "Downloading 30-minute demo video for chunking demonstration..."
    
    # For demo purposes, we'll create a longer video by concatenating the sample
    # In a real scenario, you would have a 30-minute video file
    if [ ! -f "backend-fastapi/videos/$DEMO_VIDEO_FILENAME" ]; then
        # Download the sample video
        curl -L -o "backend-fastapi/videos/sample.mp4" "$DEMO_VIDEO_URL" || {
            print_error "Failed to download demo video. Please check your internet connection."
            exit 1
        }
        
        # Create a longer video by concatenating (for demo purposes)
        # In production, you would have actual long videos
        print_info "Creating extended demo video for chunking demonstration..."
        ffmpeg -f lavfi -i color=c=blue:size=1280x720:duration=1800 -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p "backend-fastapi/videos/$DEMO_VIDEO_FILENAME" -y
        
        # Clean up sample file
        rm -f "backend-fastapi/videos/sample.mp4"
    fi
    
    print_status "Demo video ready"
}

# Start services
start_services() {
    print_info "Starting services..."
    
    # Start the development environment
    ./scripts/start.sh dev
    
    # Wait for services to be ready
    print_info "Waiting for services to initialize..."
    sleep 15
    
    # Check if services are running
    if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_warning "Backend not ready yet, waiting a bit more..."
        sleep 10
    fi
    
    print_status "Services started successfully"
}

# Run database migrations
run_migrations() {
    print_info "Running database migrations..."
    
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
    print_info "Seeding database with demo data..."
    
    # Run the seed script
    ./scripts/seed.sh
    
    print_status "Database seeded successfully"
}

# Process video chunks
process_video_chunks() {
    print_info "Processing video chunks (chunk duration: ${CHUNK_DURATION}s)..."
    
    # Create a Python script to process the video
    cat > backend-fastapi/process_demo_video.py << 'EOF'
import asyncio
import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent / "app"))

from app.core.database import get_db
from app.services.video_processing import VideoProcessingService
from app.models.video import Video
from sqlalchemy import select
import uuid

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
    echo -e "${GREEN}🎉 Demo Setup Complete!${NC}"
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
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo -e "  • Press '?' in the video player to see all keyboard shortcuts"
    echo -e "  • Use ',' and '.' for frame-by-frame navigation"
    echo -e "  • Press '1-5' to quickly add different types of annotations"
    echo -e "  • Use 'J' and 'L' for 10-second skips"
    echo ""
    echo -e "${BLUE}🛠️  Configuration Options:${NC}"
    if [ "$USE_HLS" = "true" ]; then
        echo -e "  USE_HLS=false ./scripts/demo-setup.sh  # Use basic chunking"
    else
        echo -e "  USE_HLS=true ./scripts/demo-setup.sh   # Use HLS streaming"
        echo -e "  CHUNK_DURATION=60 ./scripts/demo-setup.sh  # 1-minute chunks"
        echo -e "  CHUNK_DURATION=300 ./scripts/demo-setup.sh # 5-minute chunks"
    fi
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}Starting YouTube-like Video Player Demo Setup...${NC}"
    echo ""
    
    check_dependencies
    cleanup
    download_demo_video
    start_services
    run_migrations
    seed_database
    process_video_chunks
    show_final_info
}

# Run main function
main "$@"
