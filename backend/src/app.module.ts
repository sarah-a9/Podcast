import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { EpisodeModule } from './Episode/episode.module';
import { PodcastModule } from './Podcast/podcast.module';
import { CategoryModule } from './Category/category.module';
import { PlaylistService } from './Playlist/playlist.service';
import { PlaylistController } from './Playlist/playlist.controller';
import { PlaylistModule } from './Playlist/playlist.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/Podcast')
    ,UserModule, EpisodeModule , PodcastModule, CategoryModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
