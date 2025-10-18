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
