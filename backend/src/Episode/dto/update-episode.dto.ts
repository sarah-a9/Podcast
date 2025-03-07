import { IsNotEmpty, IsString } from "class-validator";

export class UpdateEpisodeDto{

        @IsNotEmpty()
        @IsString()
        episodeTitle : string ;
    
        @IsNotEmpty()
        @IsString()
        episodeDescription : string;

        
}