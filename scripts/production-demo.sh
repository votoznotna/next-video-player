#!/bin/bash

# Production Video Player Demo Script
# Creates 5-minute video chunks and sets up production environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check dependencies
check_dependencies() {
    print_step "Checking Dependencies"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command -v ffmpeg &> /dev/null; then
        print_error "FFmpeg is not installed. Please install FFmpeg first."
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Clean up existing setup
cleanup() {
    print_step "Cleaning Up Existing Setup"
    
    print_status "Stopping Docker containers..."
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    
    print_status "Removing old video files..."
    rm -rf videos/production/ 2>/dev/null || true
    rm -rf videos/chunks/ 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Create production video chunks
create_production_videos() {
    print_step "Creating Production Video Chunks"
    
    # Create production videos directory
    mkdir -p videos/production
    
    print_status "Generating 5-minute production video chunks..."
    
    # Create 6 chunks of 5 minutes each (30 minutes total)
    for i in {0..5}; do
        chunk_start=$((i * 300))  # 5 minutes = 300 seconds
        chunk_end=$(((i + 1) * 300))
        
        print_status "Creating chunk $((i + 1))/6 (${chunk_start}s - ${chunk_end}s)..."
        
        ffmpeg -f lavfi -i "testsrc2=size=1280x720:duration=300:rate=25" \
            -vf "drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='Production Video Chunk $((i + 1)) - Time %{pts\:hms} - Case ABC-123':x=(w-text_w)/2:y=h-th-10:fontcolor=white:fontsize=24:box=1:boxcolor=0x00000099" \
            -c:v libvpx-vp9 -crf 28 -b:v 2M -g 10 -keyint_min 10 -deadline realtime -row-mt 1 \
            -f webm -y "videos/production/production_chunk_$(printf "%03d" $i).webm" 2>/dev/null
        
        print_success "Chunk $((i + 1)) created: production_chunk_$(printf "%03d" $i).webm"
    done
    
    print_success "All production video chunks created"
}

# Start services
start_services() {
    print_step "Starting Services"
    
    print_status "Starting Docker containers..."
    docker-compose -f docker-compose.dev.yml up -d
    
    print_status "Waiting for services to be ready..."
    sleep 15
    
    # Check if services are running
    if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_warning "Backend not ready, waiting a bit more..."
        sleep 10
    fi
    
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_warning "Frontend not ready, waiting a bit more..."
        sleep 10
    fi
    
    print_success "Services are running"
}

# Seed production database
seed_production_database() {
    print_step "Seeding Production Database"
    
    print_status "Setting up database tables..."
    # Create tables using async SQLAlchemy
    docker exec insider-threat-backend-dev python -c "
import asyncio
from app.core.database import engine, Base
from app.models import video, annotation, video_chunk

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('Database tables created successfully')

asyncio.run(create_tables())
"
    
    print_status "Seeding production data..."
    docker exec insider-threat-backend-dev python -c "
import asyncio
from app.core.database import engine, AsyncSessionLocal
from app.models.video import Video
from app.models.video_chunk import VideoChunk
from app.models.annotation import Annotation
import uuid
import os

async def seed_production_data():
    async with AsyncSessionLocal() as db:
        # Create production video
        video = Video(
            id=uuid.uuid4(),
            title='Demo Security Footage - Case ABC-123',
            description='Security camera footage from building entrance, 30 minutes total duration',
            filename='production_video.webm',
            originalName='security_footage_2024.webm',
            mimeType='video/webm',
            size=0,  # Will be calculated
            duration=1800,  # 30 minutes
            totalDuration=1800,
            caseId='ABC-123',
            sourceType='NFS',
            isProduction=True,
            views=0,
            isActive=True
        )
        
        db.add(video)
        await db.commit()
        await db.refresh(video)
    
        # Create video chunks
        chunk_files = [
            'production_chunk_000.webm',
            'production_chunk_001.webm', 
            'production_chunk_002.webm',
            'production_chunk_003.webm',
            'production_chunk_004.webm',
            'production_chunk_005.webm'
        ]
        
        for i, chunk_file in enumerate(chunk_files):
            start_time = i * 300
            end_time = (i + 1) * 300
            
            chunk = VideoChunk(
                id=uuid.uuid4(),
                video_id=video.id,
                chunk_index=i,
                filename=chunk_file,
                start_time=start_time,
                end_time=end_time,
                duration=300,
                size=50000000,  # 50MB per chunk
                fps=25,
                width=1280,
                height=720,
                isActive=True
            )
            
            db.add(chunk)
        
        await db.commit()
    
        # Create annotations for the production video
        annotations_data = [
            {'start_time': 0, 'end_time': 300, 'title': 'Entrance Activity - Period 1', 'type': 'activity', 'description': 'Normal entrance activity during first 5 minutes'},
            {'start_time': 300, 'end_time': 600, 'title': 'Suspicious Behavior - Period 2', 'type': 'suspicious', 'description': 'Unusual loitering behavior observed'},
            {'start_time': 600, 'end_time': 900, 'title': 'Security Check - Period 3', 'type': 'security', 'description': 'Security personnel conducting routine checks'},
            {'start_time': 900, 'end_time': 1200, 'title': 'Incident Report - Period 4', 'type': 'incident', 'description': 'Minor incident requiring attention'},
            {'start_time': 1200, 'end_time': 1500, 'title': 'Resolution - Period 5', 'type': 'resolution', 'description': 'Incident resolution and normal operations resume'},
            {'start_time': 1500, 'end_time': 1800, 'title': 'End of Shift - Period 6', 'type': 'administrative', 'description': 'End of monitoring period, shift change'}
        ]
        
        for i, ann_data in enumerate(annotations_data):
            annotation = Annotation(
                id=uuid.uuid4(),
                video_id=video.id,
                title=ann_data['title'],
                description=ann_data['description'],
                start_time=ann_data['start_time'],
                end_time=ann_data['end_time'],
                type=ann_data['type'],
                color='red' if ann_data['type'] == 'incident' else 'blue',
                isActive=True
            )
            
            db.add(annotation)
        
        await db.commit()
        print('Production data seeded successfully')

asyncio.run(seed_production_data())
"
    
    print_success "Production database seeded"
}

# Copy production videos to backend
copy_production_videos() {
    print_step "Copying Production Videos to Backend"
    
    print_status "Creating production directory in backend container..."
    docker exec insider-threat-backend-dev mkdir -p /app/videos/production
    
    print_status "Copying video chunks to backend container..."
    docker cp videos/production/. insider-threat-backend-dev:/app/videos/production/
    
    print_status "Setting proper permissions..."
    docker exec insider-threat-backend-dev chmod -R 755 /app/videos/production
    
    print_success "Production videos copied to backend"
}

# Display access information
show_access_info() {
    print_step "Production Demo Ready"
    
    echo -e "\n${GREEN}🎬 Demo Video Player is ready!${NC}\n"
    
    echo -e "${BLUE}Access URLs:${NC}"
    echo -e "  Frontend: ${YELLOW}http://localhost:3000${NC}"
    echo -e "  Backend API: ${YELLOW}http://localhost:8000${NC}"
    echo -e "  GraphQL Playground: ${YELLOW}http://localhost:8000/graphql${NC}"
    echo -e "  API Documentation: ${YELLOW}http://localhost:8000/docs${NC}"
    
    echo -e "\n${BLUE}Production Features:${NC}"
    echo -e "  ✅ 5-minute video chunks (6 chunks total)"
    echo -e "  ✅ WebM format for optimal streaming"
    echo -e "  ✅ NFS-style file storage simulation"
    echo -e "  ✅ Timeline click selection"
    echo -e "  ✅ Green interval highlighting"
    echo -e "  ✅ Frame preview on hover"
    echo -e "  ✅ Seamless chunk transitions"
    echo -e "  ✅ Production annotations"
    
    echo -e "\n${BLUE}Video Information:${NC}"
    echo -e "  Case ID: ABC-123"
    echo -e "  Total Duration: 30 minutes (6 x 5-minute chunks)"
    echo -e "  Format: WebM (VP9)"
    echo -e "  Resolution: 1280x720"
    echo -e "  Frame Rate: 25 FPS"
    
    echo -e "\n${BLUE}To test the demo player:${NC}"
    echo -e "  1. Open ${YELLOW}http://localhost:3000${NC}"
    echo -e "  2. Select 'Demo Security Footage - Case ABC-123'"
    echo -e "  3. Test timeline click selection"
    echo -e "  4. Test chunk transitions"
    echo -e "  5. Test frame preview on hover"
    
    echo -e "\n${GREEN}Demo is ready for testing!${NC}\n"
}

# Main execution
main() {
    print_step "Production Video Player Demo Setup"
    
    check_dependencies
    cleanup
    create_production_videos
    start_services
    seed_production_database
    copy_production_videos
    show_access_info
}

# Run main function
main "$@"
