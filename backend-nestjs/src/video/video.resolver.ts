import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { VideoService } from './video.service';
import { Video } from './entities/video.entity';
import { CreateVideoInput } from './dto/create-video.input';
import { UseGuards } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Resolver(() => Video)
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @Mutation(() => Video)
  async createVideo(@Args('createVideoInput') createVideoInput: CreateVideoInput): Promise<Video> {
    return this.videoService.create(createVideoInput);
  }

  @Query(() => [Video], { name: 'videos' })
  async findAll(): Promise<Video[]> {
    return this.videoService.findAll();
  }

  @Query(() => Video, { name: 'video' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Video> {
    return this.videoService.findOne(id);
  }

  @Mutation(() => Boolean)
  async removeVideo(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.videoService.remove(id);
  }
}
