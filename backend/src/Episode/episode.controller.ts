import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import mongoose from 'mongoose';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Controller('episode')
export class EpisodeController {

    constructor(private readonly episodeService : EpisodeService){}

    // @UseGuards() 
    @Post()
    CreateEpisode(@Body() createEpisodeDto : CreateEpisodeDto){
        return this.episodeService.createEpisode(createEpisodeDto);
    }

    @Get()
    getEpisodes(){
        return this.episodeService.getEpisodes();
    }

    @Get(':id')
    getEpisodeById(@Param('id') id : string){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid ID', 400);
        const findEpisode = this.episodeService.getEpisodeById(id);
        if (!findEpisode) throw new HttpException('Episode Not Found', 404);
        return findEpisode;
    }

    // @UseGuards() 
    @Patch(':id')
    updateEpisode(@Param('id')id:string , updateEpisodeDto:UpdateEpisodeDto)
    {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid ID', 400);
        const savedEpisode = this.episodeService.updateEpisode(id , updateEpisodeDto);
        if (!savedEpisode) throw new HttpException('Episode Not Found', 404);
        return savedEpisode;

    }

    // @UseGuards() 
    @Delete(':id')
    deleteEpisode(@Param('id')id:string)
    {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) throw new HttpException('Invalid ID', 400);
        const deletedEpisode = this.episodeService.deleteEpisode(id);
        if (!deletedEpisode) throw new HttpException('Episode Not Found' , 404);
        return deletedEpisode;
    }
}
