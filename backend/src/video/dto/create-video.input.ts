import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

@InputType()
export class CreateVideoInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @Field(() => Float)
  @IsNumber()
  size: number;

  @Field(() => Float)
  @IsNumber()
  duration: number;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  @IsOptional()
  views?: number;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
