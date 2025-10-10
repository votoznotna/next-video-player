import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoInput } from './dto/create-video.input';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async create(createVideoInput: CreateVideoInput): Promise<Video> {
    const video = this.videoRepository.create(createVideoInput);
    return this.videoRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return this.videoRepository.find({
      where: { isActive: true },
      relations: ['annotations'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id, isActive: true },
      relations: ['annotations'],
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    // Increment view count
    await this.incrementViews(id);

    return video;
  }

  async incrementViews(id: string): Promise<void> {
    await this.videoRepository.increment({ id }, 'views', 1);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.videoRepository.update(id, { isActive: false });
    return result.affected > 0;
  }

  async getVideoStream(filename: string): Promise<{ stream: NodeJS.ReadableStream; size: number; mimeType: string }> {
    const videoPath = join(process.cwd(), 'videos', filename);
    
    try {
      const stats = await fs.stat(videoPath);
      const stream = require('fs').createReadStream(videoPath);
      
      // Get mime type from database
      const video = await this.videoRepository.findOne({
        where: { filename },
        select: ['mimeType'],
      });

      return {
        stream,
        size: stats.size,
        mimeType: video?.mimeType || 'video/mp4',
      };
    } catch (error) {
      throw new NotFoundException(`Video file ${filename} not found`);
    }
  }
}
