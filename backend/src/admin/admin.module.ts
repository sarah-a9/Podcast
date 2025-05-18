import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PodcastService } from '../Podcast/podcast.service';
import { EpisodeService } from '../Episode/episode.service';
import { PodcastModule } from '../Podcast/podcast.module';
import { EpisodeModule } from '../Episode/episode.module';

@Module({
  imports: [PodcastModule, EpisodeModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
