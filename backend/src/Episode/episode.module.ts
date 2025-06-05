import { forwardRef, Module } from '@nestjs/common';
import { EpisodeService } from '../Episode/episode.service';
import { EpisodeController } from '../Episode/episode.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Episode, EpisodeSchema } from '../schemas/Episode.schema';
import { PodcastModule } from '../Podcast/podcast.module';
import { UserModule } from '../user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    forwardRef(() => PodcastModule),
    forwardRef(() => UserModule),
    ScheduleModule.forRoot(),
  ],
  providers: [EpisodeService],
  controllers: [EpisodeController],
  exports: [MongooseModule , EpisodeService],
})
export class EpisodeModule {}
