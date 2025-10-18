# Video Storage Best Practices Guide

## Overview

This guide provides recommendations for storing video files in development and production environments. The key principle: **never store video files directly in databases** - use databases only for metadata.

## Current Implementation

**Storage:** Local filesystem (`/videos/` directory)  
**Metadata:** PostgreSQL 15 database  
**Backend:** FastAPI with Strawberry GraphQL  
**Serving:** Static file serving via FastAPI  
**Status:** ✅ Good for development and small-scale deployments

## Why NOT to Store Videos in Databases

### Performance Issues

- Database queries become extremely slow with large binary data
- Increases backup/restore time by 10-100x
- Consumes massive amounts of database memory
- Video streaming requires sequential reads (databases aren't optimized for this)

### Scalability Problems

- Database size grows exponentially
- Expensive to scale database storage vs. object storage
- Difficult to implement CDN caching
- Can't leverage specialized video streaming infrastructure

### Cost Comparison

| Storage Type | Cost per GB/month | Backup Cost | Scalability |
| ------------ | ----------------- | ----------- | ----------- |
| PostgreSQL   | $0.10 - $0.25     | High        | Vertical    |
| MongoDB      | $0.08 - $0.20     | High        | Horizontal  |
| File System  | $0.01 - $0.05     | Medium      | Limited     |
| S3/Object    | $0.02 - $0.03     | Low         | Unlimited   |

## Recommended Approaches

### 1. Development Environment (Current) ✅

**Architecture:**

```
Videos: Local filesystem (/videos/)
Metadata: PostgreSQL
Serving: Direct static file serving
```

**Pros:**

- Simple setup, no external dependencies
- Fast local development
- Easy debugging
- No costs

**Cons:**

- Doesn't scale horizontally
- No CDN support
- Single point of failure
- Not suitable for production

**When to Use:**

- Local development
- Testing and prototyping
- Small internal tools
- Single-server deployments with <100 videos

### 2. Production - Object Storage (Recommended) ⭐

**Architecture:**

```
Videos: AWS S3 / Google Cloud Storage / Azure Blob / MinIO
Metadata: PostgreSQL
CDN: CloudFront / CloudFlare
Streaming: Pre-signed URLs
```

**Implementation Options:**

#### Option A: AWS S3 (Managed Cloud)

```yaml
# Estimated costs for 1TB storage, 1TB transfer
Storage: $23/month
Transfer: $90/month (first 10TB)
Requests: ~$1/month
Total: ~$114/month
```

**Pros:**

- Highly reliable (99.999999999% durability)
- Global infrastructure
- Easy CDN integration
- Automatic backups
- Scalable to petabytes

**Cons:**

- Ongoing costs
- Vendor lock-in
- Requires AWS account

#### Option B: MinIO (Self-Hosted S3-Compatible)

```yaml
# Docker setup
minio:
  image: minio/minio
  ports:
    - '9000:9000'
    - '9001:9001'
  volumes:
    - minio_data:/data
  environment:
    MINIO_ROOT_USER: admin
    MINIO_ROOT_PASSWORD: your-secure-password
  command: server /data --console-address ":9001"
```

**Pros:**

- Free and open-source
- S3-compatible API (easy migration to AWS later)
- Full control over data
- No vendor lock-in
- Can run on your own infrastructure

**Cons:**

- You manage infrastructure
- Need to handle backups
- Need to scale manually

**When to Use:**

- Production applications
- Need to scale beyond single server
- Want CDN integration
- Multiple servers/regions
- 100+ videos or 10GB+ storage

### 3. Production - Video Platform Services 🚀

**Architecture:**

```
Videos: Cloudflare Stream / Mux / Vimeo API
Metadata: PostgreSQL
Streaming: Platform-provided URLs
```

**Popular Services:**

#### Cloudflare Stream

- **Cost:** $1 per 1,000 minutes stored + $1 per 1,000 minutes delivered
- **Features:** Automatic transcoding, adaptive bitrate, global CDN
- **Best for:** High-quality streaming, global audience

#### Mux

- **Cost:** $0.05 per GB stored + $0.01 per GB delivered
- **Features:** Video analytics, thumbnails, HLS/DASH streaming
- **Best for:** Professional video applications

#### Vimeo API

- **Cost:** Starting at $75/month
- **Features:** Player customization, privacy controls, analytics
- **Best for:** Business video hosting

**Pros:**

- Automatic transcoding to multiple resolutions
- Adaptive bitrate streaming (HLS/DASH)
- Built-in CDN and global distribution
- Thumbnail generation
- Analytics and engagement metrics
- DRM and content protection

**Cons:**

- Monthly costs (can be expensive at scale)
- Vendor lock-in
- Less control over infrastructure

**When to Use:**

- Professional video applications
- Need adaptive streaming
- Want analytics and insights
- Global audience
- Need DRM/content protection

## Migration Path: Development → Production

### Phase 1: Current State (Development)

```
✅ Videos in /videos/ directory
✅ PostgreSQL for metadata
✅ Static file serving
```

### Phase 2: Add MinIO (Staging)

```bash
# 1. Add MinIO to docker-compose.yml
# 2. Install MinIO client library
pip install minio  # Python (for FastAPI backend)

# 3. Update backend to upload to MinIO
# 4. Generate pre-signed URLs for streaming
# 5. Test with existing videos
```

### Phase 3: Production Ready

```
Option A: Keep MinIO on your infrastructure
Option B: Migrate to AWS S3/GCS
Option C: Use video platform service
```

## Implementation Examples

### Current Implementation (Filesystem)

**Backend (FastAPI):**

```python
from fastapi.staticfiles import StaticFiles

# Serve static video files
app.mount("/videos", StaticFiles(directory="videos"), name="videos")
```

**Frontend:**

```typescript
<video src={`http://localhost:8000/videos/${video.filename}`} />
```

### Recommended: MinIO Implementation

**Docker Compose:**

```yaml
services:
  minio:
    image: minio/minio:latest
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: your-secure-password
    command: server /data --console-address ":9001"
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  minio_data:
```

**Backend (FastAPI):**

```python
from minio import Minio
from datetime import timedelta

minio_client = Minio(
    "localhost:9000",
    access_key="admin",
    secret_key="your-secure-password",
    secure=False
)

# Upload video
async def upload_video(file: UploadFile):
    bucket_name = "videos"
    file_name = f"{int(time.time())}-{file.filename}"

    minio_client.put_object(
        bucket_name,
        file_name,
        file.file,
        length=-1,
        part_size=10*1024*1024,
        content_type=file.content_type
    )

    return file_name

# Generate pre-signed URL (expires in 1 hour)
def get_video_url(file_name: str):
    return minio_client.presigned_get_object(
        "videos",
        file_name,
        expires=timedelta(hours=1)
    )
```

**Frontend (React with Apollo Client):**

```typescript
// Fetch video with pre-signed URL
const { data } = await apolloClient.query({
  query: GET_VIDEO,
  variables: { id: videoId },
});

// Use the pre-signed URL in video player
<video src={data.video.fileUrl} controls />;
```

### AWS S3 Implementation

**Backend (FastAPI):**

```python
import boto3
from botocore.config import Config
from datetime import timedelta

s3_client = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    config=Config(signature_version='s3v4')
)

# Upload video
async def upload_video(file: UploadFile):
    key = f"videos/{int(time.time())}-{file.filename}"

    s3_client.upload_fileobj(
        file.file,
        'your-bucket-name',
        key,
        ExtraArgs={'ContentType': file.content_type}
    )

    return key

# Generate pre-signed URL
def get_video_url(key: str):
    return s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': 'your-bucket-name', 'Key': key},
        ExpiresIn=3600
    )
```

## Database Schema (Current Implementation)

Your PostgreSQL schema stores only metadata (perfect approach):

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  filename VARCHAR(255) NOT NULL,        -- Local filename or S3 key
  "originalName" VARCHAR(255) NOT NULL,  -- Original uploaded filename
  "mimeType" VARCHAR(100) NOT NULL,      -- video/mp4, etc.
  size INTEGER NOT NULL,                 -- File size in bytes
  duration FLOAT NOT NULL,               -- Duration in seconds
  views INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For future: Add storage provider field when migrating to MinIO/S3
-- ALTER TABLE videos ADD COLUMN storage_provider VARCHAR(50) DEFAULT 'local';
-- ALTER TABLE videos ADD COLUMN storage_url TEXT;
```

## Security Considerations

### Pre-signed URLs

- Generate temporary URLs that expire (1-24 hours)
- Prevents direct access to storage
- Can revoke access by not generating new URLs

### Access Control

```python
# Example: Generate URL only for authenticated users
async def get_video_url(video_id: str, user_id: str):
    # Check if user has access
    has_access = await check_user_access(user_id, video_id)
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")

    # Generate pre-signed URL
    return await generate_presigned_url(video_id)
```

### Content Delivery

- Use CDN to reduce bandwidth costs
- Enable HTTPS only
- Implement rate limiting
- Add watermarks for premium content

## Cost Estimation

### Small Application (100 videos, 50GB, 100GB/month transfer)

| Solution          | Setup Cost | Monthly Cost | Notes              |
| ----------------- | ---------- | ------------ | ------------------ |
| Filesystem        | $0         | $5-10        | VPS storage        |
| MinIO             | $0         | $10-20       | VPS + storage      |
| AWS S3            | $0         | $10-15       | Pay as you go      |
| Cloudflare Stream | $0         | $50-100      | Per minute pricing |

### Medium Application (1,000 videos, 500GB, 1TB/month transfer)

| Solution          | Setup Cost | Monthly Cost | Notes            |
| ----------------- | ---------- | ------------ | ---------------- |
| Filesystem        | $0         | $50-100      | Larger VPS       |
| MinIO             | $0         | $100-150     | Dedicated server |
| AWS S3            | $0         | $100-120     | S3 + CloudFront  |
| Cloudflare Stream | $0         | $500-1000    | High volume      |

### Large Application (10,000+ videos, 5TB+, 10TB/month transfer)

| Solution          | Setup Cost | Monthly Cost | Notes           |
| ----------------- | ---------- | ------------ | --------------- |
| Filesystem        | N/A        | N/A          | Not scalable    |
| MinIO             | $0         | $500-1000    | Cluster setup   |
| AWS S3            | $0         | $500-800     | With CloudFront |
| Cloudflare Stream | $0         | $5000+       | Enterprise      |

## Recommendations Summary

### For Your Project

**Current Stage (Development):** ✅ Keep filesystem approach

- Simple and effective
- No changes needed
- Perfect for development

**Next Stage (Production MVP):** ⭐ Add MinIO

- Easy to set up (just add to docker-compose)
- S3-compatible (easy migration later)
- Free and self-hosted
- Scales better than filesystem

**Future Stage (Scale):** 🚀 Migrate to AWS S3 or Video Platform

- When you have 1000+ videos
- When you need global distribution
- When you need advanced features (transcoding, analytics)

### Action Items

1. **Now:** Continue with filesystem for development ✅

   - Current setup: FastAPI + PostgreSQL + local `/videos/` directory
   - Works perfectly for development and testing

2. **Before Production:** Add MinIO to docker-compose

   - Add MinIO service to `docker-compose.yml`
   - Install `minio` Python package in `requirements.txt`

3. **Update Backend:** Add MinIO upload/download logic

   - Create MinIO client in FastAPI
   - Add upload endpoint for video files
   - Generate pre-signed URLs in GraphQL resolvers

4. **Update Database:** Add storage provider fields

   - `ALTER TABLE videos ADD COLUMN storage_provider VARCHAR(50) DEFAULT 'local';`
   - `ALTER TABLE videos ADD COLUMN storage_url TEXT;`

5. **Test:** Verify video streaming works with pre-signed URLs

   - Upload test video to MinIO
   - Verify GraphQL returns correct URL
   - Test video playback in frontend

6. **Deploy:** Use MinIO for production

   - Configure MinIO with persistent volumes
   - Set up backup strategy
   - Monitor storage usage

7. **Later:** Migrate to AWS S3 when needed
   - When scaling beyond single server
   - When need global CDN distribution
   - When need advanced features

## Additional Resources

- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [AWS S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/best-practices.html)
- [Cloudflare Stream](https://developers.cloudflare.com/stream/)
- [Video Streaming Protocols (HLS/DASH)](https://www.cloudflare.com/learning/video/what-is-http-live-streaming/)

## Conclusion

**Key Takeaway:** Never store videos in databases (PostgreSQL or MongoDB). Use databases for metadata only, and store video files in object storage (MinIO/S3) or specialized video platforms.

Your current PostgreSQL setup is perfect - just use it for metadata, not video files.
