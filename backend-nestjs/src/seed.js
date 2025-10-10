const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const { VideoService } = require('./video/video.service');
const { AnnotationService } = require('./annotation/annotation.service');
const fs = require('fs').promises;
const path = require('path');

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const videoService = app.get(VideoService);
  const annotationService = app.get(AnnotationService);

  try {
    // Create videos directory if it doesn't exist
    const videosDir = path.join(process.cwd(), 'videos');
    await fs.mkdir(videosDir, { recursive: true });

    // Sample video data
    const sampleVideos = [
      {
        title: 'Introduction to React Hooks',
        description:
          'Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.',
        filename: 'react-hooks-intro.mp4',
        originalName: 'react-hooks-intro.mp4',
        mimeType: 'video/mp4',
        size: 15728640, // 15MB
        duration: 1200, // 20 minutes
        views: 0,
        isActive: true,
      },
      {
        title: 'Advanced TypeScript Patterns',
        description:
          'Explore advanced TypeScript patterns and best practices for large-scale applications.',
        filename: 'typescript-advanced.mp4',
        originalName: 'typescript-advanced.mp4',
        mimeType: 'video/mp4',
        size: 25165824, // 24MB
        duration: 1800, // 30 minutes
        views: 0,
        isActive: true,
      },
      {
        title: 'GraphQL with NestJS',
        description: 'Build scalable APIs with GraphQL and NestJS framework.',
        filename: 'graphql-nestjs.mp4',
        originalName: 'graphql-nestjs.mp4',
        mimeType: 'video/mp4',
        size: 31457280, // 30MB
        duration: 2400, // 40 minutes
        views: 0,
        isActive: true,
      },
    ];

    console.log('🌱 Seeding videos...');
    const createdVideos = [];

    for (const videoData of sampleVideos) {
      const video = await videoService.create(videoData);
      createdVideos.push(video);
      console.log(`✅ Created video: ${video.title}`);
    }

    // Sample annotations for the first video
    const sampleAnnotations = [
      {
        title: 'Introduction',
        description: 'Welcome and overview of the course',
        startTime: 0,
        endTime: 60,
        type: 'chapter',
        color: '#3B82F6',
        videoId: createdVideos[0].id,
      },
      {
        title: 'useState Hook',
        description: 'Understanding the useState hook for state management',
        startTime: 60,
        endTime: 300,
        type: 'chapter',
        color: '#10B981',
        videoId: createdVideos[0].id,
      },
      {
        title: 'useEffect Hook',
        description: 'Side effects and lifecycle management with useEffect',
        startTime: 300,
        endTime: 600,
        type: 'chapter',
        color: '#F59E0B',
        videoId: createdVideos[0].id,
      },
      {
        title: 'Custom Hooks',
        description: 'Creating reusable custom hooks',
        startTime: 600,
        endTime: 900,
        type: 'chapter',
        color: '#EF4444',
        videoId: createdVideos[0].id,
      },
      {
        title: 'Best Practices',
        description: 'React Hooks best practices and common pitfalls',
        startTime: 900,
        endTime: 1200,
        type: 'chapter',
        color: '#8B5CF6',
        videoId: createdVideos[0].id,
      },
    ];

    console.log('🌱 Seeding annotations...');
    for (const annotationData of sampleAnnotations) {
      const annotation = await annotationService.create(annotationData);
      console.log(`✅ Created annotation: ${annotation.title}`);
    }

    // Create placeholder video files
    console.log('📁 Creating placeholder video files...');
    for (const video of createdVideos) {
      const videoPath = path.join(videosDir, video.filename);
      try {
        await fs.access(videoPath);
        console.log(`📹 Video file already exists: ${video.filename}`);
      } catch {
        // Create a placeholder file
        await fs.writeFile(videoPath, 'Placeholder video content');
        console.log(`📹 Created placeholder file: ${video.filename}`);
      }
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await app.close();
  }
}

seed();
