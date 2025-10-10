import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnotationService } from './annotation.service';
import { AnnotationResolver } from './annotation.resolver';
import { Annotation } from './entities/annotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Annotation])],
  providers: [AnnotationResolver, AnnotationService],
  exports: [AnnotationService],
})
export class AnnotationModule {}
