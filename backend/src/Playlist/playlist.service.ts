import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist } from 'src/schemas/Playlist.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { User } from 'src/schemas/User.schema';
import { Episode, EpisodeDocument } from 'src/schemas/Episode.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private PlaylistModel: Model<Playlist>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Episode.name)private EpisodeModel: Model<EpisodeDocument> 
    
  ) {}

  // Create a new playlist
  async createPlaylist(createPlaylistDto: CreatePlaylistDto) {
    // Create and save the new playlist
    const newPlaylist = new this.PlaylistModel(createPlaylistDto);
    await newPlaylist.save();

    await this.UserModel.findByIdAndUpdate(
      createPlaylistDto.creator, // Assuming 'creator' is the user ID
      { $push: { playlists: newPlaylist._id } }, // Add the playlist ID to user's array
      { new: true },
    );

    // Fetch the saved playlist with the creator details populated
    return this.PlaylistModel.findById(newPlaylist._id)
      .populate({ path: 'creator', model: 'User', select: 'firstName' })
      .exec();
  }

  async getAllPlaylists() {
    return this.PlaylistModel.find()
      .populate({
        path: 'episodes',
        model: 'Episode',
        select: 'episodeTitle episodeDescription  createdAt',
      })
      .populate({
        path: 'creator',
        model: 'User',
        select: 'firstName',
      })
      .exec();
  }

  async getPlaylistById(id: string) {
    return this.PlaylistModel.findById(id)
      .populate({
        path: 'episodes',
        model: 'Episode',
        select: 'episodeTitle episodeDescription audioUrl createdAt likedByUsers podcast creator',
        populate: {
          path: 'podcast',
          model: 'Podcast',
          select: 'podcastImage',
          populate: {
            path: 'creator', // Now populate the creator inside the podcast
            model: 'User',
            select: 'firstName lastName', 
          },
        },
      })
      .exec();
  }
  
  

  // Add an episode to the playlist (without duplicates)
  // async addEpisode(playlistId: string, episodeId: string) {
  //   const updatedPlaylist = await this.PlaylistModel.findByIdAndUpdate(
  //     playlistId,
  //     { $addToSet: { episodes: episodeId } }, // Prevent duplicates
  //     { new: true }
  //   );

  //   if (!updatedPlaylist) {
  //     throw new NotFoundException('Playlist not found');
  //   }

  //   // Fetch updated playlist and populate the 'Episodes' field
  //   return this.PlaylistModel.findById(playlistId).populate({path:'episodes' , model:'Episode' , select:'episodeTitle episodeDescription '}).populate({path:'creator' , model:'User' , select:'firstName'});
  // }

  // Add an episode to the playlist (bi-directional and without duplicates)
  async addEpisode(playlistId: string, episodeId: string) {
    // Step 1: Add episode to playlist (if not already present)
    const updatedPlaylist = await this.PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $addToSet: { episodes: episodeId } }, // Prevent duplicates
      { new: true },
    );

    if (!updatedPlaylist) {
      throw new NotFoundException('Playlist not found');
    }

    // Step 2: Add playlist to episode (if not already present)
    const updatedEpisode = await this.EpisodeModel.findByIdAndUpdate(
      episodeId,
      { $addToSet: { playlists: playlistId } }, // Prevent duplicates
      { new: true },
    );

    if (!updatedEpisode) {
      throw new NotFoundException('Episode not found');
    }

    // Step 3: Return populated playlist
    return this.PlaylistModel.findById(playlistId)
      .populate({
        path: 'episodes',
        model: 'Episode',
        select: 'episodeTitle episodeDescription',
      })
      .populate({ path: 'creator', model: 'User', select: 'firstName' });
  }

  // Remove an episode from the playlist
  // async removeEpisode(playlistId: string, episodeId: string) {
  //   return this.PlaylistModel.findByIdAndUpdate(
  //     playlistId,
  //     { $pull: { episodes: episodeId } }, // Remove specific episode
  //     { new: true },
  //   );
  // }


  // Remove an episode from the playlist AND remove the playlist from the episode
async removeEpisode(playlistId: string, episodeId: string) {
  // Step 1: Remove episode from playlist
  const updatedPlaylist = await this.PlaylistModel.findByIdAndUpdate(
    playlistId,
    { $pull: { episodes: episodeId } },
    { new: true },
  );

  if (!updatedPlaylist) {
    throw new NotFoundException('Playlist not found');
  }

  // Step 2: Remove playlist from episode
  await this.EpisodeModel.findByIdAndUpdate(
    episodeId,
    { $pull: { playlists: playlistId } },
  );

  // Optional: return the updated playlist with populated fields
  return this.PlaylistModel.findById(playlistId)
    .populate({ path: 'episodes', model: 'Episode', select: 'episodeTitle episodeDescription' })
    .populate({ path: 'creator', model: 'User', select: 'firstName' });
}


  // Find playlists by user and populate episodes
  async findByUser(userId: string): Promise<Playlist[]> {
    return this.PlaylistModel.find({ user: userId })
      .populate('episodes') // Fetch full episode data
      .exec();
  }

  // Update an existing playlist
  async updatePlaylist(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    return this.PlaylistModel.findByIdAndUpdate(id, updatePlaylistDto, {
      new: true,
    });
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
      { new: true },
    );

    //Remove playlists references from the episode
    await this.EpisodeModel.updateMany(
      { playlists: playlistId },
      { $pull: { playlists: playlistId } }, // Remove the playlist reference from each episode
    );

    // Delete the playlist
    return await this.PlaylistModel.findByIdAndDelete(playlistId);
  }
}
