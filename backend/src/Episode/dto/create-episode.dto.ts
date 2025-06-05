import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Episodestatus } from "../../schemas/Episode.schema";

export class CreateEpisodeDto{

    @IsNotEmpty()
    @IsString()
    episodeTitle : string ;

    @IsNotEmpty()
    @IsString()
    episodeDescription : string;


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