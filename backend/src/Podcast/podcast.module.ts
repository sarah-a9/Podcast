import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, Module } from '@nestjs/common';
import { Podcast, PodcastSchema } from "src/schemas/Podcast.schema";
import { PodcastService } from "./podcast.service";
import { PodcastController } from "./podcast.controller";
import { EpisodeModule } from "src/Episode/episode.module";
import { UserModule } from "src/user/user.module";
 

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Podcast.name, schema: PodcastSchema }]),
    forwardRef(() => EpisodeModule),UserModule,
  ],
  providers: [PodcastService],
  controllers: [PodcastController],
  exports:[MongooseModule],
})
export class PodcastModule {}