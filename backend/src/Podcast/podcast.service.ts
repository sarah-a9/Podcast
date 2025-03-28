import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Podcast, PodcastDocument } from 'src/schemas/Podcast.schema';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Episode, EpisodeDocument } from 'src/schemas/Episode.schema'; // Import Episode schema
import { User, UserDocument } from 'src/schemas/User.schema';

@Injectable()
export class PodcastService {
  constructor(
    @InjectModel(Podcast.name) private PodcastModel: Model<PodcastDocument>,
    @InjectModel(Episode.name) private EpisodeModel: Model<EpisodeDocument>, // Inject Episode model
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
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
  return savedPodcast;
  }






  async getAllPodcast() {
    return await this.PodcastModel
      .find()
      .populate({
        path: 'creator',  // Populate only the creator field
        select: 'firstName'  // Only the creator's firstName, not all user details
        
      })
      .populate({path: 'episodes', model:"Episode"  ,match: {}}).populate({path: 'categories',
        model:"Category" ,select:'categoryName' }).exec();
  }





  async getPodcastById(id: string) {
    const podcast = await this.PodcastModel
      .findById(id)
      .populate({
        path: 'creator',  // Populate only the creator field
        select: 'firstName'  // Only the creator's firstName, not all user details
      }).populate({
        path: 'episodes', // Populate episodes
         model:"Episode",
        select: 'episodeTitle episodeDescription  createdAt' // Specify which fields you want from the episodes
      }).populate({path: 'categories', // Populate episodes
        model:"Category" ,select:'categoryName'}).exec();

      if (!podcast) {
        throw new NotFoundException("Podcast not found");
      }
      
     return podcast;
  }


  async getEpisodeByPodcastId(podcastId: string, episodeId: string) {
    // Find the podcast by ID
    const podcast = await this.PodcastModel.findById(podcastId)
      .populate({
        path: 'episodes',
        model: 'Episode',
        match: { _id: episodeId },  // Match the specific episode ID
        select: 'episodeTitle episodeDescription audioUrl createdAt',  // Fields to return from the episode
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
  
}
