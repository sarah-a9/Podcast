import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { PodcastService } from '../Podcast/podcast.service';
import { EpisodeService } from '../Episode/episode.service';

@Controller('admin')
// @UseGuards(AuthGuard) // + RolesGuard
// @Roles(0) // Admin role
export class AdminController {
  constructor(private readonly adminService: AdminService,
    private readonly podcastService: PodcastService,
    private readonly episodeService: EpisodeService,
    // private readonly userService: UserService,
    // private readonly categoryService: CategoryService,
    // private readonly playlistService: PlaylistService,
  ) {}


  @Get('most-favorited-podcasts')
  getMostFavorited() {
    return this.podcastService.getMostFavoritedPodcasts();
  }

  @Get('most-liked-episodes')
  getMostLiked() {
    return this.episodeService.getMostLikedEpisodes();
  }

  @Get('top-rated-episodes')
  getTopRated() {
    return this.episodeService.getTopRatedEpisodes();
  }

  @Get('top-listened-episodes')
  async getTopListened() {
    return this.episodeService.getTopListenedEpisodes();
  }


  
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
