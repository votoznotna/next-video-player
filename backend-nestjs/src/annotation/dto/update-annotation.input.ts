import { InputType, Field, Float, PartialType } from '@nestjs/graphql';
import { CreateAnnotationInput } from './create-annotation.input';

@InputType()
export class UpdateAnnotationInput extends PartialType(CreateAnnotationInput) {}
