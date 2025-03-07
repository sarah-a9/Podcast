import { Controller, Post, Body, Param, Delete, Put, Get, Patch, NotFoundException } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from 'src/schemas/Playlist.schema';

@Controller('Playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // Create a new playlist
  @Post()
  async create(@Body() createPlaylistDto: CreatePlaylistDto){
    return this.playlistService.createPlaylist(createPlaylistDto);
  }

  // Add an episode to a playlist
  @Post(':playlistId/episode/:episodeId')
  async addEpisode(
    @Param('playlistId') playlistId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.playlistService.addEpisode(playlistId, episodeId);
  }

  // Remove an episode from a playlist
  @Delete(':playlistId/episode/:episodeId')
  async removeEpisode(
    @Param('playlistId') playlistId: string,
    @Param('episodeId') episodeId: string,
  ){
    return this.playlistService.removeEpisode(playlistId, episodeId);
  }

  // Get all playlists
  @Get()
  async getAllPlaylists() {
  const playlists = await this.playlistService.getAllPlaylists();
  if (!playlists || playlists.length === 0) {
    throw new NotFoundException('No playlists found');
  }
  return playlists;
  }


  // Get a playlist by ID
  @Get(':id')
  async getPlaylistById(@Param('id') id: string) {
    const playlist = await this.playlistService.getPlaylistById(id);
    if (!playlist) {
    throw new NotFoundException('Playlist not found');
    }
  return playlist;
  }

  // Find playlists by user
  @Get('user/:userId')
  async getPlaylistsByUser(@Param('userId') userId: string) {
    return this.playlistService.findByUser(userId);
  }

  // Update a playlist
  @Patch(':id')
  async updatePlaylist(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.updatePlaylist(id, updatePlaylistDto);
  }


  // Delete a playlist
  @Delete(':id')
  async deletePlaylist(@Param('id') id: string) {
    return this.playlistService.deletePlaylist(id);
  }
}
