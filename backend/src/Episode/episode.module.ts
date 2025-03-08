import { forwardRef, Module } from '@nestjs/common';
import { EpisodeService } from '../Episode/episode.service';
import { EpisodeController } from '../Episode/episode.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Episode, EpisodeSchema } from 'src/schemas/Episode.schema';
import { PodcastModule } from '../Podcast/podcast.module';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    forwardRef(() => PodcastModule),
  ],
  providers: [EpisodeService],
  controllers: [EpisodeController],
  exports: [MongooseModule],
})
export class EpisodeModule {}
