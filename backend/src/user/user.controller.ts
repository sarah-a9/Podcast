import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Types } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard'; // Import AuthGuard
import { PodcastService } from 'src/Podcast/podcast.service';
import { EpisodeService } from 'src/Episode/episode.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly podcastService: PodcastService,
    private readonly episodeService: EpisodeService,
  ) {}

  // Public route to create a user (No authentication needed)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Public route to get all users (Optional, but generally public)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Protect this route with AuthGuard (get a user by ID, needs authentication)
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User Not Found', 404);
    const findUser = await this.userService.findOne(id);
    if (!findUser) throw new HttpException("User Not Found", 404);
    return findUser;
  }



  @UseGuards(AuthGuard)
  @Get(':id/favoritePodcasts')
  async getFavoritePodcasts(@Param('id') id:string){
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Usee Not Found', 404);
    const favoritePodcasts = await this.userService.getFavoritePodcasts(id);
    if (!favoritePodcasts) throw new HttpException("User Not Found", 404);
    return favoritePodcasts;

  }




  @UseGuards(AuthGuard)
  @Get(':id/likedEpisodes')
  async getLikedEpisodes(@Param('id') id:string){
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Usee Not Found', 404);
    const LikedEpisodes = await this.userService.getLikedEpisodes(id);
    if (!LikedEpisodes) throw new HttpException("User Not Found", 404);
    return LikedEpisodes;

  }



  // Protect this route with AuthGuard (update a user by ID, needs authentication)
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException("Invalid ID", 400);
    const updateUser = await this.userService.update(id, updateUserDto);
    if (!updateUser) throw new HttpException('User Not Found', 404);
    return updateUser;
  }

  @UseGuards(AuthGuard)
  @Patch('updateProfile')
  async updateCurrentUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    console.log("userId in controller:", req.userId); // 👈
    const userId = req.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpException("Invalid or missing user ID", 400);
    }

    const updatedUser = await this.userService.update(userId, updateUserDto);

    if (!updatedUser) {
      throw new HttpException("User Not Found", 404);
    }

    return updatedUser;
  }

  @UseGuards(AuthGuard)
  @Delete('profile')
  async deleteCurrentUser(@Req() req) {
    const userId = req.userId;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpException("Invalid or missing user ID", 400);
    }

    const deletedUser = await this.userService.remove(userId);
    if (!deletedUser) throw new HttpException("User Not Found", 404);
    return { message: "User successfully deleted" };
  }



  // Protect this route with AuthGuard (delete a user by ID, needs authentication)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException("Invalid ID", 400);
    const deletedUser = await this.userService.remove(id);
    if (!deletedUser) throw new HttpException("User Not Found", 404);
    return deletedUser;
  }


  @UseGuards(AuthGuard)
  @Post(':userId/favorite/:podcastId')
  async FavoritePodcast(@Param('userId') userId: string,@Param('podcastId') podcastId: string,) {
    
    
    const user = await this.userService.findOne(userId);
    const podcast = await this.podcastService.getPodcastById(podcastId);

     const podcastObjectId = new Types.ObjectId(podcastId);
     const userObjectId = new Types.ObjectId(userId);

    if (!user || !podcast) {
      throw new Error('User or Podcast not found');
    }

    const isAlreadyFavorited = user.favoritePodcasts.includes(podcastObjectId);

    if (isAlreadyFavorited) {
      // Unfavorite: Remove podcast from user's favoritePodcasts and remove user from podcast's favoritedByUsers
      user.favoritePodcasts = user.favoritePodcasts.filter(
        (id) => !id.equals(podcastId),
      );
      podcast.favoritedByUsers = podcast.favoritedByUsers.filter(
        (userId) => !userObjectId.equals(user.id),
      );
    } else {
      // Favorite: Add podcast to user's favoritePodcasts and add user to podcast's favoritedByUsers
      user.favoritePodcasts.push(podcastObjectId);
      podcast.favoritedByUsers.push(user.id);
    }

    await user.save();
    await podcast.save();

    return { message: isAlreadyFavorited ? 'Podcast unfavorited' : 'Podcast favorited' };
  }

  @UseGuards(AuthGuard)
  @Post(':userId/like/:episodeId')
  async likeOrUnlikeEpisode(
    @Param('userId') userId: string,
    @Param('episodeId') episodeId: string,
  ) {
    // Convert IDs to ObjectIds
    const episodeObjectId = new Types.ObjectId(episodeId);
    const userObjectId = new Types.ObjectId(userId);

    // Find the user
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    // Find the episode
    const episode = await this.episodeService.getEpisodeById(episodeId);
    if (!episode) {
      throw new HttpException('Episode not found', 404);
    }

    // Check if the user already liked the episode
    if (!user.likedEpisodes.includes(episodeObjectId)) {
      // Like the episode if not liked already
      user.likedEpisodes.push(episodeObjectId);
      episode.likedByUsers.push(userObjectId);

      await user.save();
      await episode.save();

      return { message: 'Episode liked successfully' };
    } else {
      // Unlike the episode if already liked
      user.likedEpisodes = user.likedEpisodes.filter(
        (id) => !id.equals(episodeObjectId),
      );
      episode.likedByUsers = episode.likedByUsers.filter(
        (id) => !id.equals(userObjectId),
      );

      await user.save();
      await episode.save();

      return { message: 'Episode unliked successfully' };
    }
  }
  

}
// 