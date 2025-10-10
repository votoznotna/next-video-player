import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annotation } from './entities/annotation.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';

@Injectable()
export class AnnotationService {
  constructor(
    @InjectRepository(Annotation)
    private annotationRepository: Repository<Annotation>,
  ) {}

  async create(createAnnotationInput: CreateAnnotationInput): Promise<Annotation> {
    const annotation = this.annotationRepository.create(createAnnotationInput);
    return this.annotationRepository.save(annotation);
  }

  async findAll(): Promise<Annotation[]> {
    return this.annotationRepository.find({
      where: { isActive: true },
      relations: ['video'],
      order: { startTime: 'ASC' },
    });
  }

  async findByVideoId(videoId: string): Promise<Annotation[]> {
    return this.annotationRepository.find({
      where: { videoId, isActive: true },
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Annotation> {
    const annotation = await this.annotationRepository.findOne({
      where: { id, isActive: true },
      relations: ['video'],
    });

    if (!annotation) {
      throw new NotFoundException(`Annotation with ID ${id} not found`);
    }

    return annotation;
  }

  async update(id: string, updateAnnotationInput: UpdateAnnotationInput): Promise<Annotation> {
    const annotation = await this.findOne(id);
    Object.assign(annotation, updateAnnotationInput);
    return this.annotationRepository.save(annotation);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.annotationRepository.update(id, { isActive: false });
    return result.affected > 0;
  }
}
