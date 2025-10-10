import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUUID } from 'class-validator';

@InputType()
export class CreateAnnotationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  startTime: number;

  @Field(() => Float)
  @IsNumber()
  endTime: number;

  @Field({ defaultValue: 'chapter' })
  @IsString()
  @IsOptional()
  type?: string;

  @Field({ defaultValue: '#3B82F6' })
  @IsString()
  @IsOptional()
  color?: string;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  videoId: string;
}
