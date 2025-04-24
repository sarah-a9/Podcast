import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Episode, EpisodeDocument, Episodestatus } from 'src/schemas/Episode.schema';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Podcast, PodcastDocument } from 'src/schemas/Podcast.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EpisodeService {

    private readonly logger = new Logger(EpisodeService.name);
    
    constructor (@InjectModel(Episode.name)private EpisodeModel: Model<EpisodeDocument> ,
                 @InjectModel(Podcast.name)private PodcastModel: Model<PodcastDocument> ,
    ){}

    // this will run every minute and we made it so we can convert from scheduled to published
    @Cron(CronExpression.EVERY_MINUTE)
    private async publishScheduled() {
        const now = new Date();
        const toPublish = await this.EpisodeModel.find({
        status: Episodestatus.SCHEDULED,
        scheduledAt: { $lte: now },
        });
        for (const ep of toPublish) {
        ep.status = Episodestatus.PUBLISHED;
        await ep.save();
        }
        if (toPublish.length) {
        this.logger.log(`Auto-published ${toPublish.length} scheduled episode(s)`);
        }
    }

    async createEpisode(dto: CreateEpisodeDto, audioFile?: Express.Multer.File) {
        const podcast = await this.PodcastModel.findById(dto.podcast);
        if (!podcast) throw new NotFoundException('Podcast not found');
    
        if (!audioFile) {
          throw new InternalServerErrorException('Audio file missing');
        }
    
        const audioUrl = `/uploads/episodes/${audioFile.filename}`;
    
        const data: Partial<Episode> = {
          episodeTitle: dto.episodeTitle,
          episodeDescription: dto.episodeDescription,
          podcast: new Types.ObjectId(dto.podcast),
        //   creator: new Types.ObjectId(dto.creator),
          audioUrl,
          status: dto.status,
          ...(dto.status === Episodestatus.SCHEDULED && dto.scheduledAt
            ? { scheduledAt: new Date(dto.scheduledAt) }
            : {}),
        };
    
        const ep = new this.EpisodeModel(data);
        const saved = await ep.save();
    
        podcast.episodes.push(saved._id as Types.ObjectId);
        await podcast.save();
    
        return saved;
      }
    

    getEpisodes(){
        return this.EpisodeModel.find();
    }


    getEpisodeById(id: string) {
      return this.EpisodeModel.findById(id).populate('podcast');
    }

    updateEpisode(id: string , updateEpisodeDto : UpdateEpisodeDto){
        return this.EpisodeModel.findByIdAndUpdate(id , updateEpisodeDto);
    }

    deleteEpisode(id:string){
        return this.EpisodeModel.findByIdAndDelete(id);
    }

    // async createEpisode(createEpisodeDto: CreateEpisodeDto) {
    //     // Step 1: Create the new episode using the data from the DTO
    //     const newEpisode = new this.EpisodeModel(createEpisodeDto);
        
    //     // Step 2: Save the new episode to the database
    //     const savedEpisode = await newEpisode.save();
        
    //     // Step 3: Find the podcast using the podcast ID from the episode's reference
    //     const podcastId = createEpisodeDto.podcastId;  // Assuming you pass the podcastId in DTO
        
    //     const podcast = await this.PodcastModel.findById(podcastId);
        
    //     if (!podcast) {
    //         throw new NotFoundException("Podcast not found");
    //     }
        
    //     // Step 4: Push the new episode's ID into the podcast's 'episodes' array
    //     podcast.episodes.push(savedEpisode._id);

    //     // Step 5: Save the updated podcast document
    //     await podcast.save();
        
    //     // Step 6: Return the saved episode
    //     return savedEpisode;
    // }

}
