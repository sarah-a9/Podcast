import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Model, Types } from 'mongoose';
import { Episode, EpisodeDocument } from 'src/schemas/Episode.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>,
@InjectModel(Episode.name) private EpisodeModel: Model<EpisodeDocument>){}; //


  async create(createUserDto: CreateUserDto) {
    const newUser = new this.UserModel(createUserDto);
    const savedUser = await newUser.save();
     return savedUser;

  }

  // async findAll() {
  //   return this.UserModel.find().
  //   populate({path: 'podcasts', model:"Podcast", select: 'podcastName podcastDescription podcastImage categories ',
  //   populate:{path:'categories', model:'Category' , select:'categoryName'},match: {}  }).
  //   populate({path:'playlists', model:'Playlist' , select:'playlistName playlistDescription' , 
  //   populate:{path:'episodes' ,model:'Episode' , select :'episodeName episodeDescription '}}).exec(); // 🔥 Populate podcasts when fetching users
  // }

  async findAll() {
    return this.UserModel.find()
        .populate({
            path: 'podcasts',
            model: "Podcast",
            select: 'podcastName podcastDescription podcastImage categories',
            populate: [
              { path: 'categories', model: 'Category', select: 'categoryName' },
              { path: 'episodes', model: 'Episode', select: 'episodeName' } // ⬅️ Add this
            ],        })
        .populate({
            path: 'playlists',
            model: 'Playlist',
            select: 'playlistName playlistDescription',
            populate: {
                path: 'episodes',
                model: 'Episode',
                select: 'episodeName episodeDescription',
                populate: {
                    path: 'podcast', // Populate the podcast of each episode
                    model: 'Podcast',
                    select: 'podcastName',
                    populate: {
                        path: 'creator', // Get the creator of the podcast
                        model: 'User',
                        select: 'firstName lastName email',
                    }
                }
            }
        })
        .exec();
}

async getFavoritePodcasts(id: string) {
  return this.UserModel.findById(id)
    .select('firstName lastName') // Selecting only firstName and lastName from the User model
    .populate({
      path: 'favoritePodcasts', // Populating the 'favoritePodcasts' field
      model: 'Podcast', // 'Podcast' model should be correctly defined
      select: 'podcastName podcastDescription podcastImage categories creator',  populate: {
        path: 'creator', // Get the creator of the podcast
        model: 'User',
        select: 'firstName lastName ',
    }// Only select relevant fields for the podcasts
    })
    .exec(); // Execute the query and return the result
}


async getPlaylistsByUser(userId: string) {
  const user = await this.UserModel.findById(userId)
  .populate({
    path: 'playlists',
    model: 'Playlist',
    select: 'playlistName playlistDescription playlistImg creator episodes',
    populate: [
      {
        path: 'episodes',
        model: 'Episode',
        select: 'episodeName episodeDescription',
      },
      {
        path: 'creator',
        model: 'User',
        select: 'firstName lastName',
      },
    ],
  })
  .exec();


  if (!user) {
    throw new Error('User not found');
  }

  return user.playlists; // Return the playlists
}



async getLikedEpisodes(id: string) {
  return this.UserModel.findById(id)
    .select('firstName lastName') // Use select to limit the user fields
    .populate({
      path: 'likedEpisodes', // Populate the likedEpisodes array
      model: 'Episode', // Specify the model for likedEpisodes
      select: 'episodeTitle audioUrl episodeDescription podcastId createdAt', // Select the necessary episode fields
      populate: { // Nested populate to include podcast data
        path: 'podcast', // Assuming you have a field called podcastId that references the Podcast model
        model: 'Podcast', // The model for podcast
        select: 'podcastImage podcastTitle creator',  populate: {
          path: 'creator', // Get the creator of the podcast
          model: 'User',
          select: 'firstName lastName ',
      } // Select the necessary podcast fields
      },
    })
    .exec();
}

async findOne(id: string) {
  return this.UserModel.findById(id)
    .populate({
      path: 'podcasts',
      select: 'podcastName podcastDescription podcastImage categories',
      populate: { path: 'categories', model: 'Category', select: 'categoryName' },
    })
    .populate({
      path: 'playlists',
      model: 'Playlist',
      select: 'playlistName playlistDescription playlistImg',
      populate: { path: 'episodes', model: 'Episode', select: 'episodeName episodeDescription' },
    })
    .exec();
}


  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.UserModel.findByIdAndUpdate(id, updateUserDto, { new: true }).populate('podcasts');
  }

  async remove(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }



  async rateEpisode(userId: string, episodeId: string, value: number) {
    // 1. Check if episode exists
    const episode = await this.EpisodeModel.findById(episodeId);
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
  
    // 2. Fetch the user
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // 3. Update or add the rating in User document
    const existingUserRatingIndex = user.ratings.findIndex(
      (r) => r.episode.toString() === episodeId
    );
  
    if (existingUserRatingIndex !== -1) {
      // If already rated, update
      user.ratings[existingUserRatingIndex].value = value;
    } else {
      // Else, push new
      user.ratings.push({
        episode: new Types.ObjectId(episodeId),
        value,
      });
    }
    await user.save();
  
    // 4. Update or add the user's rating in Episode document
    const existingEpisodeRatingIndex = episode.ratings.findIndex(
      (r) => r.user.toString() === userId
    );
  
    if (existingEpisodeRatingIndex !== -1) {
      // If already rated, update
      episode.ratings[existingEpisodeRatingIndex].value = value;
    } else {
      // Else, push new
      episode.ratings.push({
        user: new Types.ObjectId(userId),
        value,
      });
    }
  
    // 5. Calculate the new average rating for the episode
    const averageRating = episode.ratings.reduce((acc, cur) => acc + cur.value, 0) / episode.ratings.length;
  
    // 6. Update the episode's average rating
    episode.averageRating = averageRating; // Assuming you have an 'averageRating' field in the Episode schema
    await episode.save();
  
    return {
      message: 'Rating submitted successfully',
      averageRating,
      userRating: user.ratings.find((r) => r.episode.toString() === episodeId) // return user’s individual rating
    };
    
  }
  

async countUsersByRoles(): Promise<{ role: string; count: number }[]> {
  const users = await this.UserModel.find().populate('podcasts');

  let adminCount = 0;
  let creatorCount = 0;
  let listenerCount = 0;

  users.forEach(user => {
    const userRole = Number(user.role);
    if (userRole === 0) {
      adminCount++;
    } else if (userRole === 1) {
      if (user.podcasts && user.podcasts.length > 0) {
        creatorCount++;
      } else {
        listenerCount++;
      }
    }
  });

  return [
    { role: 'Admin', count: adminCount },
    { role: 'Creator', count: creatorCount },
    { role: 'Listener', count: listenerCount },
  ];
}
}
