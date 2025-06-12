import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import mongoose from 'mongoose';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { AuthGuard } from '../guards/auth.guard'; // import the AuthGuard
import { UserService } from '../user/user.service';
import { Types } from 'mongoose'; // Import Types from Mongoose
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RateEpisodeDto } from './dto/rate-episode.dto';
import { Episodestatus } from '../schemas/Episode.schema';
import { JwtService } from '@nestjs/jwt';

@Controller('episode')
export class EpisodeController {
  constructor(
    // private readonly userService: UserService,
    private readonly episodeService: EpisodeService,
    private readonly jwtService: JwtService,
  ) {}

  // Protect the CreateEpisode route with AuthGuard
  @UseGuards(AuthGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('audioFile', {
      storage: diskStorage({
        // destination: './uploads/episodes',
        destination: './public/audio',
        filename: (_req, file, cb) => {
          const name = Date.now() + extname(file.originalname);
          cb(null, name);
        },
      }),
      fileFilter: (_req, file, cb) => {
        cb(null, !!file.mimetype.match(/\/(mpeg|mp3|wav)$/));
      },
    }),
  )
  async createEpisode(
    @UploadedFile() audioFile: Express.Multer.File,
    @Body() body: any,
  ) {
    // Validate required fields:
    if (
      !body.episodeTitle ||
      !body.episodeDescription ||
      !body.podcast ||
      !body.creator
    ) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dto: CreateEpisodeDto = {
      episodeTitle: body.episodeTitle,
      episodeDescription: body.episodeDescription,
      podcastImage: body.podcastImage,
      podcast: body.podcast,
      creator: body.creator,
      status: body.status,
      scheduledAt: body.scheduledAt,
    };

    return this.episodeService.createEpisode(dto, audioFile);
  }

  // Open to everyone, no guard needed
  @Get()
  getEpisodes() {
    return this.episodeService.getEpisodes();
  }


  @Get(':id')
  async getEpisodeById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    const episode = await this.episodeService.getEpisodeById(id);
    if (!episode) throw new HttpException('Episode Not Found', 404);

    return episode;
  }

 
  // Protect the update route with AuthGuard
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('audioFile', {
      storage: diskStorage({
        destination: './public/audio',
        filename: (_req, file, cb) => {
          const name = Date.now() + extname(file.originalname);
          cb(null, name);
        },
      }),
      fileFilter: (_req, file, cb) => {
        cb(null, !!file.mimetype.match(/\/(mpeg|mp3|wav)$/));
      },
    }),
  )
  async updateEpisode(
    @Param('id') id: string,
    @UploadedFile() audioFile: Express.Multer.File,
    @Body() body: any,
  ) {
    // 1) Validate ID
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    // 2) Build an UpdateEpisodeDto from body
    const dto: UpdateEpisodeDto = {
      episodeTitle: body.episodeTitle,
      episodeDescription: body.episodeDescription,
      status: body.status,
      scheduledAt: body.scheduledAt,
      // We do NOT include audioUrl here; we’ll set it manually if audioFile is present
    };

    // 3) If a new audio file was uploaded, build its URL
    if (audioFile) {
      // Assuming your episodes store audioUrl as a full URL:
      dto.audioUrl = `http://127.0.0.1:3000/audio/${audioFile.filename}`;
    }

    // 4) Call the service
    const updatedEpisode = await this.episodeService.updateEpisode(id, dto);

    if (!updatedEpisode) {
      throw new HttpException('Episode Not Found', HttpStatus.NOT_FOUND);
    }
    return updatedEpisode;
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


  @Patch(':id/play')
async incrementListens(@Param('id') id: string) {
  return this.episodeService.incrementListens(id);
}

// ── REPORT an episode (authenticated only) ──
  @UseGuards(AuthGuard)
  @Patch(':id/report')
  async reportEpisode(@Param('id') id: string, @Req() req: any) {
    // 1) Verify JWT & extract userId from payload:
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    let payload: any;
    try {
      payload = this.jwtService.verify(authHeader.slice(7));
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const currentUserId = payload._id;

    // Fetch raw episode (no populate):
    const episode = await this.episodeService.findByIdRaw(id);
    if (!episode) throw new NotFoundException('Episode not found');

    

    // Only a “PUBLISHED” episode may be reported:
    if (episode.status !== Episodestatus.PUBLISHED) {
      throw new BadRequestException('Only published episodes can be reported');
    }

    // Flip to REPORTED:
    await this.episodeService.reportEpisode(id);
    return { message: 'Episode has been reported' };
  }

  //  ARCHIVE a reported episode (admin only) ──
  @UseGuards(AuthGuard)
  @Patch(':id/archive')
  async archiveEpisode(@Param('id') id: string, @Req() req: any) {
    // Verify JWT & extract role:
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    let payload: any;
    try {
      payload = this.jwtService.verify(authHeader.slice(7));
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const currentUserRole = payload.role;

    // Only role 0 (admin) can archive:
    if (currentUserRole !== 0) {
      throw new ForbiddenException('Only admins can archive episodes');
    }

    // Archive it:
    await this.episodeService.archiveEpisode(id);
    return { message: 'Episode archived' };
  }



 
}
