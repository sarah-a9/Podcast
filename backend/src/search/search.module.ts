import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PodcastModule } from 'src/Podcast/podcast.module';
import { EpisodeModule } from 'src/Episode/episode.module';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/Category/category.module';

@Module({
    imports: [PodcastModule , EpisodeModule, UserModule , CategoryModule],
    controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
