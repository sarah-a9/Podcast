import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Episode, EpisodeDocument } from 'src/schemas/Episode.schema';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Podcast, PodcastDocument } from 'src/schemas/Podcast.schema';

@Injectable()
export class EpisodeService {
constructor (@InjectModel(Episode.name)private EpisodeModel: Model<EpisodeDocument> ,@InjectModel(Podcast.name)private PodcastModel: Model<PodcastDocument>){}




async createEpisode(createEpisodeDto: CreateEpisodeDto) {
    const { podcast } = createEpisodeDto;

    // Ensure the podcast exists before adding the episode
    const findPodcast = await this.PodcastModel.findById(podcast);
    if (!findPodcast) {
        throw new NotFoundException("Podcast not found");
    }

    // Create the new episode
    const newEpisode = new this.EpisodeModel(createEpisodeDto);

    // Save the new episode
    const savedEpisode = await newEpisode.save();

    // Add the new episode to the podcast's episodes array
    findPodcast.episodes.push(savedEpisode._id as any);

    // Save the updated podcast document
    await findPodcast.save();

    return savedEpisode;
}




 getEpisodes(){
    return this.EpisodeModel.find();
}


getEpisodeById(id : string){
    return this.EpisodeModel.findById(id);
    
}

updateEpisode(id: string , updateEpisodeDto : UpdateEpisodeDto){
    return this.EpisodeModel.findByIdAndUpdate(id , updateEpisodeDto);
}

deleteEpisode(id:string){
    return this.EpisodeModel.findByIdAndDelete(id);
}











}
