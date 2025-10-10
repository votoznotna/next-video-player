import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Video } from '../../video/entities/video.entity';

@Entity('annotations')
@ObjectType()
export class Annotation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column('float')
  @Field(() => Float)
  startTime: number;

  @Column('float')
  @Field(() => Float)
  endTime: number;

  @Column({ default: 'chapter' })
  @Field()
  type: string; // 'chapter', 'highlight', 'note'

  @Column({ default: '#3B82F6' })
  @Field()
  color: string;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column('uuid')
  videoId: string;

  @ManyToOne(() => Video, video => video.annotations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'videoId' })
  @Field(() => Video)
  video: Video;
}
