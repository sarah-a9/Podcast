import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist } from 'src/schemas/Playlist.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PlaylistService {
  constructor(@InjectModel(Playlist.name) private PlaylistModel: Model<Playlist>, 
  @InjectModel(User.name) private UserModel: Model<User>
) {}

  // Create a new playlist
  async createPlaylist(createPlaylistDto: CreatePlaylistDto) {
    // Create and save the new playlist
    const newPlaylist = new this.PlaylistModel(createPlaylistDto);
    await newPlaylist.save();

    await this.UserModel.findByIdAndUpdate(
      createPlaylistDto.creator, // Assuming 'creator' is the user ID
      { $push: { playlists: newPlaylist._id } }, // Add the playlist ID to user's array
      { new: true }
    );
  
    // Fetch the saved playlist with the creator details populated
    return this.PlaylistModel.findById(newPlaylist._id).populate({path:'creator' , model :'User' , select:'firstName'}).exec();
  }
  

  async getAllPlaylists(){
    return this.PlaylistModel.find().populate({path :'episodes' , model:'Episode' , select: 'episodeTitle episodeDescription  createdAt'}).populate({
      path :'creator' , model : 'User' , select:'firstName'}).exec();
  }


  async getPlaylistById(id:string){
    return this.PlaylistModel.findById(id).populate({path :'episodes' , model: 'Episode' , select: 'episodeTitle episodeDescription '}).populate({
      path :'creator' , model : 'User' , select:'firstName'}).exec();
  }

  // Add an episode to the playlist (without duplicates)
  async addEpisode(playlistId: string, episodeId: string) {
    const updatedPlaylist = await this.PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $addToSet: { episodes: episodeId } }, // Prevent duplicates
      { new: true }
    );
  
    if (!updatedPlaylist) {
      throw new NotFoundException('Playlist not found');
    }
  
    // Fetch updated playlist and populate the 'Episodes' field
    return this.PlaylistModel.findById(playlistId).populate({path:'episodes' , model:'Episode' , select:'episodeTitle episodeDescription '}).populate({path:'creator' , model:'User' , select:'firstName'});
  }
  

  // Remove an episode from the playlist
  async removeEpisode(playlistId: string, episodeId: string) {
    return this.PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $pull: { episodes: episodeId } }, // Remove specific episode
      { new: true },
    );
  }

  // Find playlists by user and populate episodes
  async findByUser(userId: string): Promise<Playlist[]> {
    return this.PlaylistModel.find({ user: userId })
      .populate('episodes') // Fetch full episode data
      .exec();
  }

  // Update an existing playlist
  async updatePlaylist(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    return this.PlaylistModel.findByIdAndUpdate(id, updatePlaylistDto, { new: true });
  }

  // Delete a playlist and remove the episodes from the playlist without deleting the episodes
  async deletePlaylist(playlistId: string) {
    // Find the playlist before deleting (optional, useful for debugging)
    const playlist = await this.PlaylistModel.findById(playlistId);
    
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Remove episodes references from the playlist
    await this.PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $set: { episodes: [] } }, // Clear the episodes array without deleting actual episodes
      { new: true }
    );

    // Delete the playlist
    return  await this.PlaylistModel.findByIdAndDelete(playlistId);

   
  }


 
  
}
