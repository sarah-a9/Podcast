import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Podcast, PodcastDocument } from 'src/schemas/Podcast.schema';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Episode, EpisodeDocument, Episodestatus } from 'src/schemas/Episode.schema'; // Import Episode schema
import { User, UserDocument } from 'src/schemas/User.schema';
import { Category, CategoryDocument } from 'src/schemas/Category.schema';
import { populate } from 'dotenv';

@Injectable()
export class PodcastService {
  constructor(
    @InjectModel(Podcast.name) private PodcastModel: Model<PodcastDocument>,
    @InjectModel(Episode.name) private EpisodeModel: Model<EpisodeDocument>, // Inject Episode model
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Category.name) private CategoryModel: Model<CategoryDocument>,
  ) {}


  async createPodcast(createPodcastDto: CreatePodcastDto) {
    const newPodcast = new this.PodcastModel(createPodcastDto);
    const savedPodcast = await newPodcast.save();
     // Update the user's podcasts list
     await this.UserModel.findByIdAndUpdate(
      createPodcastDto.creator,  // User's ID
      { $push: { podcasts: savedPodcast._id } },  // Add the podcast ID
      { new: true }
      
  );

  // Ajouter l'ID du podcast aux catégories associées
  await this.CategoryModel.updateMany(
    { _id: { $in: createPodcastDto.categories } }, // Trouver les catégories concernées
    { $push: { listePodcasts: savedPodcast._id } } // Ajouter l'ID du podcast
  );
  return savedPodcast;
  }

  // 
  
  async getAllPodcast() {
    return this.PodcastModel.find()
      .populate('creator', 'firstName lastName')
      .populate('episodes')
      .populate('categories', 'categoryName')
      .exec();
  }

   async getPodcastById(
    id: string,
    currentUserId?: string,
    currentUserRole?: number,
  ) {
    const podcast = await this.PodcastModel
      .findById(id)
      .populate({
        path: 'creator',
        select: 'firstName lastName role',   // we need the creator’s _id and role for comparison
      })
      .populate({
        path: 'episodes',
        model: 'Episode',
        select: 'episodeTitle episodeDescription createdAt audioUrl status scheduledAt',
      })
      .populate({
        path: 'categories',
        model: 'Category',
        select: 'categoryName',
      })
      .exec();

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    // “Is the caller the creator of this podcast?”
    const isCreator =
      currentUserId != null &&
      podcast.creator._id.toString() === currentUserId;

    // “Is the caller an admin?”
    const isAdmin = currentUserRole === 0;

    if (!isCreator && !isAdmin) {
      // Allow both PUBLISHED and REPORTED for regular users.
    podcast.episodes = (podcast.episodes as any[]).filter(
      (ep: any) =>
        ep.status === Episodestatus.PUBLISHED ||
        ep.status === Episodestatus.REPORTED,
    );
    }
    // If caller is creator OR admin, do not filter—show episodes of all statuses
    return podcast;
  }


  async getEpisodeByPodcastId(podcastId: string, episodeId: string) {
    // Find the podcast by ID
    const podcast = await this.PodcastModel.findById(podcastId)
      .populate({
        path: 'episodes',
        model: 'Episode',
        match: { _id: episodeId },  // Match the specific episode ID
        select: 'episodeTitle episodeDescription audioUrl createdAt podcast likedByUsers',  // Fields to return from the episode
        populate: {
          path: 'podcast',  // Populate the 'podcast' field inside the Episode model
          model: 'Podcast',
          select:'podcastName podcastImage creator favoritedByUsers',
          populate:{
           path:'creator',
           model:'User',
           select:'firstName lastName'
          },
        },
      })
      .exec();

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    // If the episode is not found in the podcast, throw an error
    const episode = podcast.episodes.find((ep) => ep._id.toString() === episodeId);
    if (!episode) {
      throw new NotFoundException('Episode not found in this podcast');
    }

    return episode;
  }



  async updatePodcast(id: string, updatePodcastDto: UpdatePodcastDto) {
    const updatedPodcast = await this.PodcastModel.findByIdAndUpdate(id,updatePodcastDto,{ new: true },);

    return updatedPodcast;
  }


  async deletePodcast(id: string) {
    const podcast = await this.PodcastModel.findById(id);
    if (!podcast) throw new NotFoundException('Podcast Not Found');
    
    
    // Delete associated episodes if needed
    await this.EpisodeModel.deleteMany({ _id: { $in: podcast.episodes } });
  
    // Remove podcast ID from the user's podcasts array
    await this.UserModel.updateMany(
      { podcasts: id }, // Find users who have this podcast ID in their array
      { $pull: { podcasts: id } } // Remove the podcast ID from the user's podcasts array
    );
  
    // Delete the podcast itself
    return await this.PodcastModel.findByIdAndDelete(id);
  }


  async findByCreator(creatorId: string) {
    return this.PodcastModel.find({ creator: creatorId }).populate('categories', 'categoryName').exec();
  }


  
  async getEpisodesByPodcastId(podcastId: string) {
    const podcast = await this.PodcastModel.findById(podcastId);
  
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }
  
    const episodes = await this.EpisodeModel.find({ _id: { $in: podcast.episodes } })
      .select('episodeTitle episodeDescription createdAt audioUrl podcast likedByUsers ratings averageRating status listens')
      .populate({
        path: 'podcast',
        select: 'podcastName podcastImage creator favoritedByUsers categories',
        populate: [
          {
            path: 'creator',
            select: 'firstName lastName',
          },
          {
            path: 'categories',
            model: 'Category',
            select: 'categoryName',
          },
        ],
      })
      .exec();
  
    return episodes;
  }
  

  async getPodcastByCategoryId(categoryId: string) {
    return this.PodcastModel.find({ categories: categoryId })
      .populate('categories', 'categoryName')
      .populate('creator', 'firstName lastName')
      .exec();
  }
  
  async getPodcastCreationStats() {
    return this.PodcastModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);
  }

  async getTopCreatorsByPodcastCount(limit = 5) {
    return this.PodcastModel.aggregate([
      {
        $group: {
          _id: '$creator',
          podcastCount: { $sum: 1 },
        },
      },
      { $sort: { podcastCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'creatorInfo',
        },
      },
      {
        $unwind: '$creatorInfo',
      },
      {
        $project: {
          creatorName: {
            $concat: ['$creatorInfo.firstName', ' ', '$creatorInfo.lastName'],
          },
          podcastCount: 1,
          _id: 0,
        },
      },
    ]);
  }


  async getMostFavoritedPodcasts(limit = 10) {
    const docs = await this.PodcastModel
      .find()
      .sort({ 'favoritedByUsers.length': -1 }) // sort by array size
      .limit(limit)
      .select('podcastName favoritedByUsers')
      .lean()
      .exec();

    return docs.map(doc => ({
      podcastName: doc.podcastName,
      favoriteCount: Array.isArray(doc.favoritedByUsers) 
        ? doc.favoritedByUsers.length 
        : 0,
    }));
  }



  
}