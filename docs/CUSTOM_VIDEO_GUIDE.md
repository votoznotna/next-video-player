# 🎬 Custom Video Configuration Guide

This guide shows you how to use your own video files with the YouTube-like video player and enable frame preview functionality.

## 🚀 **Quick Setup with Your Own Video**

### **Method 1: Production Video Setup (Recommended)**

1. **Place your video file** in the `videos/production/` directory:

   ```bash
   cp /path/to/your/video.webm videos/production/your_video.webm
   ```

2. **Run the production demo script** to automatically chunk your video:

   ```bash
   ./scripts/production-demo.sh
   ```

3. **Your video will be automatically**:
   - ✅ Chunked into 5-minute segments (production-ready)
   - ✅ WebM format with VP9 codec
   - ✅ HTTP Range Request streaming enabled
   - ✅ Metadata stored in database
   - ✅ Frame previews enabled
   - ✅ Ready to play with production features

### **Method 2: Legacy Demo Setup (Educational)**

1. **Place your video file** in the `videos/` directory:

   ```bash
   cp /path/to/your/video.mp4 videos/demo_video.mp4
   ```

2. **Run the legacy demo script** to automatically chunk your video:

   ```bash
   ./scripts/start-demo.sh
   ```

3. **Your video will be automatically**:
   - ✅ Chunked into 2-minute segments
   - ✅ MP4 format with H.264 codec
   - ✅ Basic streaming
   - ✅ Metadata stored in database
   - ✅ Frame previews enabled

### **Method 2: Add New Video via API**

1. **Upload your video** to the `videos/` directory
2. **Create video record** via API:

   ```bash
   curl -X POST "http://localhost:8000/api/v1/videos/" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "My Custom Video",
       "description": "Description of my video",
       "filename": "my_video.mp4",
       "originalName": "my_video.mp4",
       "mimeType": "video/mp4",
       "size": 52428800,
       "duration": 1800
     }'
   ```

3. **Chunk the video**:
   ```bash
   curl -X POST "http://localhost:8000/api/v1/videos/{video_id}/chunk"
   ```

## 🎯 **Supported Video Formats**

### **Recommended Formats:**

- **MP4** (H.264) - Best compatibility
- **WebM** (VP9) - Good for web
- **MOV** (H.264) - Apple format

### **Video Specifications:**

- **Resolution**: Any (1280x720 recommended)
- **Frame Rate**: 24-60 FPS
- **Duration**: Any length (will be chunked automatically)
- **Codec**: H.264, VP9, or VP8

## ⚙️ **Configuration Options**

### **Chunk Duration**

Modify chunk size in `scripts/start-demo.sh`:

```bash
# Change this line:
CHUNK_DURATION=120  # 2 minutes in seconds

# To your preferred duration:
CHUNK_DURATION=300  # 5 minutes
CHUNK_DURATION=60   # 1 minute
```

### **Video Processing Settings**

Edit `backend-fastapi/app/services/video_processing.py`:

```python
# Chunk duration (seconds)
self.chunk_duration = 120  # Change this value

# FFmpeg settings for chunking
.output(str(output_path),
       vcodec='libx264',     # Video codec
       acodec='aac',         # Audio codec
       preset='fast',        # Encoding speed
       crf=23)              # Quality (18-28)
```

## 🎨 **Frame Preview Features**

### **How Frame Preview Works:**

1. **Hover over timeline** - Shows video frame at that time
2. **Automatic caching** - Frames are cached for smooth experience
3. **Canvas-based** - Uses HTML5 Canvas for frame extraction
4. **Real-time generation** - No server-side processing needed

### **Frame Preview Settings:**

```typescript
// In SimpleVideoPlayer.tsx
const generateFramePreview = useCallback(async (time: number) => {
  // Canvas quality settings
  canvas.toBlob(
    (blob) => {
      resolve(blob!);
    },
    'image/jpeg',
    0.8
  ); // Quality: 0.1-1.0
});
```

## 🔧 **Advanced Configuration**

### **Custom Video Sources**

#### **Local File:**

```typescript
// In VideoPlayerPage.tsx
const video = {
  id: 'custom-video',
  title: 'My Video',
  filename: 'my_video.mp4',
  duration: 1800,
};
```

#### **Remote URL:**

```typescript
// For remote videos, modify SimpleVideoPlayer.tsx
const videoSrc = `https://example.com/videos/${video.filename}`;
// or
const videoSrc = video.url; // if video object has url property
```

### **Database Configuration**

#### **Add Custom Video to Database:**

```python
# In backend-fastapi/seed.py
custom_videos = [
    {
        "title": "My Custom Video",
        "description": "My video description",
        "filename": "my_video.mp4",
        "originalName": "my_video.mp4",
        "mimeType": "video/mp4",
        "size": 104857600,  # 100MB
        "duration": 3600,   # 1 hour
    }
]
```

## 🎬 **YouTube-like Features Available**

### **✅ Frame Preview on Hover**

- Move mouse over timeline to see video frames
- Cached for smooth performance
- Shows exact frame at hover position

### **✅ Keyboard Shortcuts**

- **Space**: Play/Pause
- **←/→**: Seek 10 seconds
- **↑/↓**: Volume control
- **M**: Mute/Unmute
- **F**: Fullscreen
- **J/L**: Frame-by-frame seeking
- **0-9**: Seek to percentage

### **✅ Advanced Controls**

- **Playback speed**: 0.25x to 2x
- **Volume control**: 0-100%
- **Fullscreen mode**
- **Annotation markers**: Colored timeline segments
- **Progress bar**: Click to seek

### **✅ Chunk Loading**

- **Automatic chunking**: Large videos split into segments
- **Efficient loading**: Only loads needed chunks
- **Metadata tracking**: Each chunk stored in database
- **Configurable duration**: Adjust chunk size as needed

## 🐛 **Troubleshooting**

### **Frame Preview Not Working:**

1. **Check video format**: Ensure MP4 with H.264 codec
2. **Browser compatibility**: Use Chrome/Firefox/Safari
3. **CORS issues**: Ensure video is served from same domain
4. **Video loading**: Wait for video to fully load

### **Video Not Playing:**

1. **File format**: Convert to MP4 if needed
2. **File size**: Check if file is too large
3. **Network**: Ensure stable connection
4. **Browser**: Try different browser

### **Chunking Issues:**

1. **FFmpeg**: Ensure FFmpeg is installed
2. **File permissions**: Check read/write permissions
3. **Disk space**: Ensure enough storage space
4. **Video corruption**: Verify video file integrity

## 📊 **Performance Tips**

### **For Large Videos:**

- **Use smaller chunks**: 60-120 seconds
- **Lower quality**: CRF 25-28 for faster processing
- **Pre-process**: Convert to optimal format first

### **For Frame Preview:**

- **Cache frames**: Frames are automatically cached
- **Limit resolution**: Lower resolution = faster preview
- **Optimize format**: Use H.264 for best performance

## 🎯 **Example: Complete Setup**

```bash
# 1. Place your video
cp ~/Downloads/my_video.mp4 videos/demo_video.mp4

# 2. Run demo (auto-chunks your video)
./scripts/start-demo.sh

# 3. Open browser
open http://localhost:3000

# 4. Enjoy YouTube-like features!
# - Hover over timeline for frame preview
# - Use keyboard shortcuts
# - Click timeline to seek
# - Adjust playback speed
```

## 🔗 **API Endpoints**

### **Video Management:**

- `GET /api/v1/videos/` - List all videos
- `POST /api/v1/videos/` - Create new video
- `GET /api/v1/videos/{id}` - Get video details
- `POST /api/v1/videos/{id}/chunk` - Chunk video

### **Video Chunks:**

- `GET /api/v1/videos/{id}/chunks` - List video chunks
- `GET /api/v1/videos/{id}/chunks/{chunk_id}/stream` - Stream chunk
- `GET /api/v1/videos/{id}/frame/{time}` - Get frame at time

### **Annotations:**

- `GET /api/v1/videos/{id}/annotations` - List annotations
- `POST /api/v1/annotations/` - Create annotation
- `PUT /api/v1/annotations/{id}` - Update annotation

---

## 🎉 **You're Ready!**

Your YouTube-like video player now supports:

- ✅ **Custom video files**
- ✅ **Frame preview on hover**
- ✅ **Automatic chunking**
- ✅ **All YouTube-like features**
- ✅ **Configurable settings**

Enjoy your enhanced video player! 🎬
