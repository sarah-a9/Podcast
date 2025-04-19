import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/User.schema';
import { PodcastModule } from '../Podcast/podcast.module';
import { EpisodeModule } from 'src/Episode/episode.module';
import { PlaylistModule } from 'src/Playlist/playlist.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name: User.name , schema : UserSchema}
    ]),forwardRef(() => PodcastModule),EpisodeModule,forwardRef(() => PlaylistModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule , UserService],
})
export class UserModule {}
