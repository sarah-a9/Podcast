import { IsString, IsNotEmpty, IsMongoId, IsOptional } from "class-validator";

export class UpdatePlaylistDto {


    @IsString()
    @IsNotEmpty()
    playlistName: string;

    @IsString()
    @IsNotEmpty()
    playlistDescription : string;

    @IsString()
    @IsNotEmpty()
    playlistImg : string ;


}
