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
    UseInterceptors,
    UploadedFile,
    Request, 
    NotFoundException,
    Query
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '../guards/auth.guard'; // Import the AuthGuard
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('podcast')
export class PodcastController {
    constructor(private readonly podcastService: PodcastService) {}

    // Protect this route with the AuthGuard
    // @UseGuards(AuthGuard)
    // @Post()
    // @UseInterceptors(FileInterceptor('podcastImage', {
    //     storage: diskStorage({
    //         destination: './uploads/podcasts',
    //         filename: (req, file, cb) => {
    //             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //             cb(null, uniqueSuffix + extname(file.originalname));
    //         },    
    //     }),
    //     fileFilter: (req, file, cb) => {
    //         if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    //           cb(new Error('Only image files are allowed!'), false);
    //         } else {
    //           cb(null, true);
    //         }
    //     },
    // }))
    // async createPodcast(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() body: any
    // )   {
    //         const createPodcastDto: CreatePodcastDto = {
    //             podcastName: body.podcastName,
    //             podcastDescription: body.podcastDescription,
    //             creator: body.creator,
    //             podcastImage: file?.filename ?? '', // Save only filename, or you can use the full URL
    //             categories: Array.isArray(body.categories)
    //               ? body.categories
    //               : body.categories
    //               ? [body.categories]
    //               : [],
    //         };
    //     return await this.podcastService.createPodcast(createPodcastDto);
    //     }






    @UseGuards(AuthGuard)
@Post()
@UseInterceptors(
  FileInterceptor('podcastImage', {
    storage: diskStorage({
      destination: './uploads/podcasts', // your folder
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname)); // generate unique filename
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        cb(new Error('Only image files are allowed!'), false); // reject non-image files
      } else {
        cb(null, true); // accept valid image files
      }
    },
  })
)
async createPodcast(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any
) {
  const createPodcastDto: CreatePodcastDto = {
    podcastName: body.podcastName,
    podcastDescription: body.podcastDescription,
    creator: body.creator,
    podcastImage: file?.filename ?? '', // Save the filename, not the full path
    categories: Array.isArray(body.categories)
      ? body.categories
      : body.categories
      ? [body.categories]
      : [], // Ensure categories is always an array
  };

  // Call service to create the podcast
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
    @UseGuards(AuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('podcastImage', {
        storage: diskStorage({
          destination: './uploads/podcasts',
          filename: (_req, file, cb) => {
            const name = Date.now() + extname(file.originalname);
            cb(null, name);
          },
        }),
        fileFilter: (_req, file, cb) => {
          cb(null, !!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/));
        },
      }))
      async updatePodcast(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any
      ) {
        const dto: UpdatePodcastDto = {
          podcastName: body.podcastName,
          podcastDescription: body.podcastDescription,
          podcastImage: file ? file.filename : body.podcastImage,
          categories: Array.isArray(body.categories)
            ? body.categories
            : body.categories
            ? [body.categories]
            : [],
        };
        return this.podcastService.updatePodcast(id, dto);
      }

    // Protect this route with the AuthGuard
    @UseGuards(AuthGuard)
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



    @Get('creator/:creatorId')
findByCreator(@Param('creatorId') creatorId: string) {
  return this.podcastService.findByCreator(creatorId);
}


 // Get all episodes for a specific podcast
 @Get(':podcastId/episodes')
 async getEpisodesByPodcastId(@Param('podcastId') podcastId: string) {
   try {
     const episodes = await this.podcastService.getEpisodesByPodcastId(podcastId);
     return episodes;
   } catch (error) {
     throw new NotFoundException(error.message);
   }
 }

@Get('category/:categoryId')
async getPodcastByCategoryId(@Param('categoryId') categoryId: string) {
    const podcasts = await this.podcastService.getPodcastByCategoryId(categoryId);
    if (!podcasts) {
        throw new NotFoundException('No podcasts found for this category');
    }
    return podcasts;
  }

  @Get('stats/created-over-time')
  getPodcastCreationStats() {
    return this.podcastService.getPodcastCreationStats();
  }

  @Get('stats/top-creators')
  getTopCreators(@Query('limit') limit: number) {
    return this.podcastService.getTopCreatorsByPodcastCount(Number(limit) || 10);
  }

}
