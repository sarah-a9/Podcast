import { IsString, IsNotEmpty, IsMongoId, IsOptional } from "class-validator";

export class CreatePlaylistDto {
    
    @IsString()
    @IsNotEmpty()
    playlistName: string;

    @IsString()
    @IsNotEmpty()
    playlistDescription : string;

    // @IsString()
    // @IsNotEmpty()
    // playlistImg : string ;


    @IsString()  // Add this to accept User ID
    @IsNotEmpty()
    creator : string;

    
}
