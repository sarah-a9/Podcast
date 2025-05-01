import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/Category.schema';
import { Episode, EpisodeDocument } from 'src/schemas/Episode.schema';
import { Podcast, PodcastDocument } from 'src/schemas/Podcast.schema';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class SearchService {

    constructor(
        @InjectModel(Podcast.name)private PodcastModel: Model<PodcastDocument> ,
        @InjectModel(Episode.name)private EpisodeModel: Model<EpisodeDocument>,
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(Category.name) private categoryModel : Model<Category>,
      ) {}
    
      async search(query: string, filter: string) {
        const regex = new RegExp(query, 'i');
    
        switch (filter) {
          case 'podcast':
            return this.PodcastModel.find({ podcastName: regex });
          case 'episode':
            return this.EpisodeModel.find({ episodeTitle: regex }).populate('podcast');
          case 'creator':
            return this.UserModel.find({ firstName: regex });
          case 'category':
            return this.categoryModel.find({ categoryName: regex });
          default:
            return [];
        }
      }
}
