import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import mongoose from 'mongoose';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { AuthGuard } from '../guards/auth.guard'; // import the AuthGuard
import { UserService } from '../user/user.service';
import { Types } from 'mongoose'; // Import Types from Mongoose

@Controller('episode')
export class EpisodeController {
  constructor(
    // private readonly userService: UserService,
    private readonly episodeService: EpisodeService,
  ) {}

  // Protect the CreateEpisode route with AuthGuard
  // @UseGuards(AuthGuard)
  @Post()
  createEpisode(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodeService.createEpisode(createEpisodeDto);
  }

  // Open to everyone, no guard needed
  @Get()
  getEpisodes() {
    return this.episodeService.getEpisodes();
  }

  // Open to everyone, no guard needed
//   @Get(':id')
//   getEpisodeById(@Param('id') id: string) {
//     const isValid = mongoose.Types.ObjectId.isValid(id);
//     if (!isValid) throw new HttpException('Invalid ID', 400);
//     const findEpisode = this.episodeService.getEpisodeById(id);
//     if (!findEpisode) throw new HttpException('Episode Not Found', 404);
//     return findEpisode;
//   }

//    // Endpoint to like/unlike an episode
//    @Post(':episodeId/like')
//    async likeEpisode(
//      @Param('episodeId') episodeId: string,
//      @Body('userId') userId: string,
//    ) {
//      // Convert the episodeId to ObjectId
//      const episodeObjectId = new Types.ObjectId(episodeId);
//      const userObjectId = new Types.ObjectId(userId);
 
//      // Find the user
//      const user = await this.userService.findOne(userId);
//      if (!user) {
//        return { message: 'User not found' };
//      }
 
//      // Find the episode
//      const episode = await this.episodeService.getEpisodeById(episodeId);
//      if (!episode) {
//        return { message: 'Episode not found' };
//      }
 
//      // Check if the episode is already liked by the user
//      if (!user.likedEpisodes.includes(episodeObjectId)) {
//        // Add episode ID to likedEpisodes if it's not already there
//        user.likedEpisodes.push(episodeObjectId);
//        episode.likedByUsers.push(userObjectId); // Add userId to likedByUsers in the episode
 
//        await user.save();
//        await episode.save(); // Save episode with updated likedByUsers
 
//        return { message: 'Episode liked successfully' };
//      } else {
//        // Remove the episode from likedEpisodes if already liked
//        user.likedEpisodes = user.likedEpisodes.filter(
//          (id) => !id.equals(episodeObjectId), // Use equals() for ObjectId comparison
//        );
 
//        // Remove userId from likedByUsers in the episode
//        episode.likedByUsers = episode.likedByUsers.filter(
//          (id) => !id.equals(userId),
//        );
 
//        await user.save();
//        await episode.save(); // Save episode with updated likedByUsers
 
//        return { message: 'Episode unliked successfully' };
//      }
//    }

  // Protect the update route with AuthGuard
  // @UseGuards(AuthGuard)
  @Patch(':id')
  updateEpisode(
    @Param('id') id: string,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    const savedEpisode = this.episodeService.updateEpisode(
      id,
      updateEpisodeDto,
    );
    if (!savedEpisode) throw new HttpException('Episode Not Found', 404);

    return savedEpisode;
  }

  // Protect the delete route with AuthGuard
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteEpisode(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    const deletedEpisode = this.episodeService.deleteEpisode(id);
    if (!deletedEpisode) throw new HttpException('Episode Not Found', 404);
    return deletedEpisode;
  }
}
