import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AnnotationService } from './annotation.service';
import { Annotation } from './entities/annotation.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';

@Resolver(() => Annotation)
export class AnnotationResolver {
  constructor(private readonly annotationService: AnnotationService) {}

  @Mutation(() => Annotation)
  async createAnnotation(@Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput): Promise<Annotation> {
    return this.annotationService.create(createAnnotationInput);
  }

  @Query(() => [Annotation], { name: 'annotations' })
  async findAll(): Promise<Annotation[]> {
    return this.annotationService.findAll();
  }

  @Query(() => [Annotation], { name: 'annotationsByVideo' })
  async findByVideoId(@Args('videoId', { type: () => ID }) videoId: string): Promise<Annotation[]> {
    return this.annotationService.findByVideoId(videoId);
  }

  @Query(() => Annotation, { name: 'annotation' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Annotation> {
    return this.annotationService.findOne(id);
  }

  @Mutation(() => Annotation)
  async updateAnnotation(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAnnotationInput') updateAnnotationInput: UpdateAnnotationInput,
  ): Promise<Annotation> {
    return this.annotationService.update(id, updateAnnotationInput);
  }

  @Mutation(() => Boolean)
  async removeAnnotation(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.annotationService.remove(id);
  }
}
