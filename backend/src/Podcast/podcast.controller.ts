import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    HttpStatus, 
    Param, 
    Patch, 
    Post, 
    UseGuards,
    Request 
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard'; // Import the AuthGuard

@Controller('podcast')
export class PodcastController {
    constructor(private readonly podcastService: PodcastService) {}

    // Protect this route with the AuthGuard
    @UseGuards(AuthGuard)
    @Post()
    async createPodcast(@Body() createPodcastDto: CreatePodcastDto ) {
        return await this.podcastService.createPodcast(createPodcastDto);
    }

    // This route can be public, so no need to protect it with AuthGuard
    @Get()
    async getAllPodcasts() {
        return await this.podcastService.getAllPodcast();
    }

    // This route can be public, so no need to protect it with AuthGuard
    @Get(':id')
    async getPodcastById(@Param('id') id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
        }

        const podcast = await this.podcastService.getPodcastById(id);
        if (!podcast) {
            throw new HttpException('Podcast Not Found', HttpStatus.NOT_FOUND);
        }

        return podcast;
    }



    
    @Get(':podcastId/episode/:episodeId')
    async getEpisodeByPodcastId(
      @Param('podcastId') podcastId: string,
      @Param('episodeId') episodeId: string
    ) {
      return this.podcastService.getEpisodeByPodcastId(podcastId, episodeId);
    }

    // Protect this route with the AuthGuard
    // @UseGuards(AuthGuard)
    @Patch(':id')
    async updatePodcast(
        @Param('id') id: string, 
        @Body() updatePodcastDto: UpdatePodcastDto
    ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
        }

        const updatedPodcast = await this.podcastService.updatePodcast(id, updatePodcastDto);
        if (!updatedPodcast) {
            throw new HttpException('Podcast Not Found', HttpStatus.NOT_FOUND);
        }

        return updatedPodcast;
    }

    // Protect this route with the AuthGuard
    // @UseGuards(AuthGuard)
    @Delete(':id')
    async deletePodcast(@Param('id') id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
        }

        const deletedPodcast = await this.podcastService.deletePodcast(id);
        if (!deletedPodcast) {
            throw new HttpException('Podcast Not Found', HttpStatus.NOT_FOUND);
        }

        return deletedPodcast;
    }
}
