import { MongooseModule } from "@nestjs/mongoose";
import { Module } from '@nestjs/common';
import { Podcast, PodcastSchema } from "src/schemas/Podcast.schema";
import { Playlist, PlaylistSchema } from "src/schemas/Playlist.schema";
import { PlaylistService } from "./playlist.service";
import { PlaylistController } from "./playlist.controller";
import { UserModule } from "src/user/user.module";


@Module({
  imports:[
    MongooseModule.forFeature([
      {name : Playlist.name , schema :PlaylistSchema}
    ]), UserModule,
  ],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}