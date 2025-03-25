import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, Module } from '@nestjs/common';
import { Podcast, PodcastSchema } from "src/schemas/Podcast.schema";
import { PodcastService } from "./podcast.service";
import { PodcastController } from "./podcast.controller";
import { EpisodeModule } from "../Episode/episode.module";
import { UserModule } from "../user/user.module";
 

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Podcast.name, schema: PodcastSchema }]),
    forwardRef(() => EpisodeModule),forwardRef(() => UserModule),
  ],
  providers: [PodcastService],
  controllers: [PodcastController],
  exports:[MongooseModule , PodcastService],
})
export class PodcastModule {}