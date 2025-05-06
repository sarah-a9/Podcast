import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import {
  Episode,
  EpisodeDocument,
  Episodestatus,
} from 'src/schemas/Episode.schema';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Podcast, PodcastDocument } from 'src/schemas/Podcast.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User, UserDocument } from 'src/schemas/User.schema';
import { RateEpisodeDto } from './dto/rate-episode.dto';

@Injectable()
export class EpisodeService {
  private readonly logger = new Logger(EpisodeService.name);

  constructor(
    @InjectModel(Episode.name) private EpisodeModel: Model<EpisodeDocument>,
    @InjectModel(Podcast.name) private PodcastModel: Model<PodcastDocument>,
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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
      this.logger.log(
        `Auto-published ${toPublish.length} scheduled episode(s)`,
      );
    }
  }

  async createEpisode(dto: CreateEpisodeDto, audioFile?: Express.Multer.File) {
    const podcast = await this.PodcastModel.findById(dto.podcast);
    if (!podcast) throw new NotFoundException('Podcast not found');

    if (!audioFile) {
      throw new InternalServerErrorException('Audio file missing');
    }

    // const audioUrl = `/uploads/episodes/${audioFile.filename}`;
    const audioUrl = `http://127.0.0.1:3000/audio/${audioFile.filename}`;


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

  getEpisodes() {
    return this.EpisodeModel.find().populate({
      path: 'podcast',
      model: 'Podcast',
      select: 'podcastImage podcastName podcastDescription creator',
      populate: {
        path: 'creator',
        model: 'User',
        select: 'firstName lastName',
      },
    });
  }

  getEpisodeById(id: string) {
    return this.EpisodeModel.findById(id).populate('podcast');
  }

  updateEpisode(id: string, updateEpisodeDto: UpdateEpisodeDto) {
    return this.EpisodeModel.findByIdAndUpdate(id, updateEpisodeDto);
  }

  deleteEpisode(id: string) {
    return this.EpisodeModel.findByIdAndDelete(id);
  }




  // async rateEpisode(userId: string, rateEpisodeDto: RateEpisodeDto) {
  //   const { episodeId, value } = rateEpisodeDto;
  
  //   // 1 Check if episode exists
  //   const episode = await this.EpisodeModel.findById(episodeId);
  //   if (!episode) {
  //     throw new NotFoundException('Episode not found');
  //   }
  
  //   // 2 Fetch the user
  //   const user = await this.userModel.findById(userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  
  //   // 3 Update or add the rating in User document
  //   const existingUserRatingIndex = user.ratings.findIndex(
  //     (r) => r.episode.toString() === episodeId
  //   );
  
  //   if (existingUserRatingIndex !== -1) {// Check if the user has already rated this episode
  //     // If already rated, update
  //     user.ratings[existingUserRatingIndex].value = value;
  //   } else {
  //     // Else, push new
  //     user.ratings.push({
  //       episode: new Types.ObjectId(episodeId), // Explicitly casting to ObjectId
  //       value,
  //     });
  //   }
  //   await user.save();
  
  //   // 4 Add user's rating to episode (if not already there)
  //   const existingEpisodeRatingIndex = episode.ratings.findIndex(
  //     (r) => r.user.toString() === userId
  //   );
  
  //   if (existingEpisodeRatingIndex !== -1) {//
  //     episode.ratings[existingEpisodeRatingIndex].value = value;
  //   } else {
  //     episode.ratings.push({
  //       user: new Types.ObjectId(userId), // Explicitly casting to ObjectId
  //       value,
  //     });
  //   }
  //   await episode.save();
  
  //   return { message: 'Rating submitted successfully' };
  // }


  
  // getAverageRating(episodeId: string) {
  //   return this.EpisodeModel.aggregate([
  //     { $match: { _id: new Types.ObjectId(episodeId) } },
  //     { $unwind: '$ratings' },
  //     {
  //       $group: {
  //         _id: '$_id',
  //         avgRating: { $avg: '$ratings.value' },
  //       },
  //     },
  //   ]);
  // }
  

  // async getUserRating(userId: string, episodeId: string) {
  //   const user = await this.userModel.findById(userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  
  //   const rating = user.ratings.find((r) => r.episode.toString() === episodeId);
  //   if (!rating) {
  //     throw new NotFoundException('Rating not found for this episode');
  //   }
  
  //   return rating.value;
  // }
  
  









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
