import { IsString, IsNotEmpty, IsMongoId, IsOptional } from "class-validator";

export class UpdatePlaylistDto {


    @IsString()
    @IsNotEmpty()
    playlistName: string;

    @IsString()
    @IsNotEmpty()
    playlistDescription : string;

    //remove this like you did with the create playlist dto and then modify the controller 
    // @IsString()
    // playlistImg?: string; // Optional, in case no image is uploaded


}
