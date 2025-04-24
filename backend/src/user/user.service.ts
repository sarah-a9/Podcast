import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>){}; //


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
            populate: { path: 'categories', model: 'Category', select: 'categoryName' },
        })
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
    return this.UserModel.findById(id).populate({
      path: 'podcasts',
      select: 'podcastName podcastDescription podcastImage categories',  // Select only the needed podcast fields
      populate:{path:'categories', model:'Category' , select:'categoryName'}}).
      populate({path:'playlists', model:'Playlist' , select:'playlistName playlistDescription playlistImg' , 
      populate:{path:'episodes' ,model:'Episode' , select :'episodeName episodeDescription '}}).exec(); // 🔥 Populate podcasts for a single user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.UserModel.findByIdAndUpdate(id, updateUserDto, { new: true }).populate('podcasts');
  }

  async remove(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
}
