import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateEpisodeDto{

    @IsNotEmpty()
    @IsString()
    episodeTitle : string ;

    @IsNotEmpty()
    @IsString()
    episodeDescription : string;


    @IsNotEmpty()
    @IsString()
    audioUrl: string;

    @IsString()
    @IsNotEmpty()
    podcast: string;  // The podcast this episode belongs to

    

}