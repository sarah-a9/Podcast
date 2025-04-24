import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Episodestatus } from "../../schemas/Episode.schema";
import { Prop } from "@nestjs/mongoose";

export class CreateEpisodeDto{

    @IsNotEmpty()
    @IsString()
    episodeTitle : string ;

    @IsNotEmpty()
    @IsString()
    episodeDescription : string;


    // @IsNotEmpty()
    // @IsString()
    // audioUrl: string;

    @IsString()
    @IsNotEmpty()
    podcast: string;  // The podcast this episode belongs to

    @IsNotEmpty() 
    @IsString() 
    creator: string;


    @IsNotEmpty() 
    @IsString() 
    podcastImage: string;


    @IsEnum(Episodestatus) 
    status: Episodestatus;

    @IsOptional() 
    @IsString()
    scheduledAt?: Date;


}