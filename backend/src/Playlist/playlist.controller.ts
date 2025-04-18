import { Controller, Post, Body, Param, Delete, Put, Get, Patch, NotFoundException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AuthGuard } from '../guards/auth.guard'; // Import the AuthGuard
import { Playlist } from 'src/schemas/Playlist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('Playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // Protect this route with AuthGuard (create a new playlist)
  // @UseGuards(AuthGuard)
  // @Post()
  // async create(@Body() createPlaylistDto: CreatePlaylistDto) {
  //   return this.playlistService.createPlaylist(createPlaylistDto);
  // }

  // Protect this route with AuthGuard (add an episode to a playlist)
  @UseGuards(AuthGuard)
  @Post(':playlistId/episode/:episodeId')
  async addEpisode(
    @Param('playlistId') playlistId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.playlistService.addEpisode(playlistId, episodeId);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/playlists', // or wherever you want to store it
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() body: CreatePlaylistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.playlistService.createPlaylist({
      ...body,
      playlistImg: file?.filename || '', // Store file name or path
    });
  }




  // Protect this route with AuthGuard (remove an episode from a playlist)
  @UseGuards(AuthGuard)
  @Delete(':playlistId/episode/:episodeId')
  async removeEpisode(
    @Param('playlistId') playlistId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.playlistService.removeEpisode(playlistId, episodeId);
  }

  // This route can be public (get all playlists)
  @Get()
  async getAllPlaylists() {
    const playlists = await this.playlistService.getAllPlaylists();
    if (!playlists || playlists.length === 0) {
      throw new NotFoundException('No playlists found');
    }
    return playlists;
  }

  // This route can be public (get a playlist by ID)
  @Get(':id')
  async getPlaylistById(@Param('id') id: string) {
    const playlist = await this.playlistService.getPlaylistById(id);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }

  // This route can be public (find playlists by user)
  @Get('user/:userId')
  async getPlaylistsByUser(@Param('userId') userId: string) {
    return this.playlistService.findByUser(userId);
  }

  // Protect this route with AuthGuard (update a playlist)
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePlaylist(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.updatePlaylist(id, updatePlaylistDto);
  }

  // Protect this route with AuthGuard (delete a playlist)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePlaylist(@Param('id') id: string) {
    return this.playlistService.deletePlaylist(id);
  }
}
