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
import { title } from 'process';

@Injectable()
export class EpisodeService {
  private readonly logger = new Logger(EpisodeService.name);

  constructor(
    @InjectModel(Episode.name) private EpisodeModel: Model<EpisodeDocument>,
    @InjectModel(Podcast.name) private PodcastModel: Model<PodcastDocument>,
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // this will run every minute and we made it so we can convert from scheduled to published
  // Cron job to flip any “scheduled” episodes whose scheduledAt ≤ now → published
  @Cron(CronExpression.EVERY_MINUTE)
  async publishScheduled() {
    const now = new Date();
    const toPublish = await this.EpisodeModel.find({
      status: Episodestatus.SCHEDULED,
      scheduledAt: { $lte: now },
    });

    for (const ep of toPublish) {
      ep.status = Episodestatus.PUBLISHED;
      // Clear scheduledAt if you prefer (optional)
      // ep.scheduledAt = undefined;
      await ep.save();
    }

    if (toPublish.length) {
      this.logger.log(
        `Auto-published ${toPublish.length} episode(s) that were scheduled.`
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

  
  async updateEpisode(id: string, dto: UpdateEpisodeDto) {
    const episode = await this.EpisodeModel.findById(id);
    if (!episode) throw new NotFoundException('Episode not found');

    // Update title/description if provided
    if (dto.episodeTitle !== undefined) {
      episode.episodeTitle = dto.episodeTitle;
    }
    if (dto.episodeDescription !== undefined) {
      episode.episodeDescription = dto.episodeDescription;
    }

    // Update status if provided
    if (dto.status) {
      episode.status = dto.status;
    }

    // Update scheduledAt if provided
    if (dto.scheduledAt) {
      episode.scheduledAt = new Date(dto.scheduledAt);
    }

    // Update audioUrl if provided
    if (dto.audioUrl) {
      episode.audioUrl = dto.audioUrl;
    }

    // If status changed to PUBLISHED, clear scheduledAt
    if (dto.status === Episodestatus.PUBLISHED) {
      episode.scheduledAt = undefined;
    }

    return await episode.save();
  }


  deleteEpisode(id: string) {
    return this.EpisodeModel.findByIdAndDelete(id);
  }


  async incrementListens(id: string) {
    const episode = await this.EpisodeModel.findByIdAndUpdate(
      id,
      { $inc: { listens: 1 } },
      { new: true }
    );
    return episode;
  }

  async getTopListenedEpisodes(limit = 5) {
    return this.EpisodeModel.find({ episodeTitle: { $exists: true, $ne: null } })
      .sort({ listens: -1 }) 
      .limit(limit)
      .select('episodeTitle listens'); 
  }


  async getMostLikedEpisodes(limit = 10) {
    const docs = await this.EpisodeModel
    .find()
    .sort({ 'likedByUsers.length': -1 })
    .limit(limit)
    .select('episodeTitle likedByUsers')    // ← récupère episodeTitle, pas `title`
    .lean()
    .exec();


    return docs.map(doc => ({
      title: doc.episodeTitle,               // ← ici c’est episodeTitle, pas title
      likeCount: Array.isArray(doc.likedByUsers)
        ? doc.likedByUsers.length
        : 0,
    }));


  }

  async getTopRatedEpisodes(limit = 10) {
    const agg = await this.EpisodeModel.aggregate([
      // unwind the ratings array, preserve episodes with no ratings
      { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },
      // group back to one doc per episode, computing count & average
      {
        $group: {
          _id: '$_id',
          title:      { $first: '$episodeTitle' },
          reviewCount:{ $sum: { $cond: [{ $ifNull: ['$ratings', false] }, 1, 0] } },
          averageRating: { $avg: '$ratings.value' },
        },
      },
      // ensure a rating of 0 if no reviews
      {
        $project: {
          _id:           0,
          title:         1,
          reviewCount:   1,
          averageRating: { $ifNull: ['$averageRating', 0] },
        },
      },
      { $sort: { averageRating: -1 } },
      { $limit: limit },
    ]);

    // Return shape { title, rating, reviewCount }
    return agg.map(doc => ({
      title:  doc.title,
      rating: Number(doc.averageRating.toFixed(2)),  // round to 2 decimals
      reviewCount: doc.reviewCount,
    }));
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
