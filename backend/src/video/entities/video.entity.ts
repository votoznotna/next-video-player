import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Annotation } from '../../annotation/entities/annotation.entity';

@Entity('videos')
@ObjectType()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column()
  @Field()
  filename: string;

  @Column()
  @Field()
  originalName: string;

  @Column()
  @Field()
  mimeType: string;

  @Column('bigint')
  @Field(() => Float)
  size: number;

  @Column('float')
  @Field(() => Float)
  duration: number;

  @Column({ default: 0 })
  @Field(() => Float)
  views: number;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @OneToMany(() => Annotation, annotation => annotation.video, { cascade: true })
  @Field(() => [Annotation], { nullable: true })
  annotations?: Annotation[];
}
