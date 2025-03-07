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


  

  async findOne(id: string) {
    return this.UserModel.findById(id).populate({
      path: 'podcasts',
      select: 'podcastName podcastDescription podcastImage categories',  // Select only the needed podcast fields
      populate:{path:'categories', model:'Category' , select:'categoryName'}}).
      populate({path:'playlists', model:'Playlist' , select:'playlistName playlistDescription' , 
      populate:{path:'episodes' ,model:'Episode' , select :'episodeName episodeDescription '}}).exec(); // 🔥 Populate podcasts for a single user
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.UserModel.findByIdAndUpdate(id, updateUserDto, { new: true }).populate('podcasts');
  }

  remove(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
}
