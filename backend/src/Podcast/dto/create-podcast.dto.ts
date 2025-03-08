import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePodcastDto{

        @IsString()
        @IsNotEmpty()
        podcastName: string;
    
        @IsString()
        @IsNotEmpty()
        podcastDescription: string;
    
        @IsString()
        @IsNotEmpty()
        podcastImage: string;


        @IsMongoId({ each: true }) // Validate an array of MongoDB ObjectIds
        @IsOptional()
        categories?: string[];

        @IsString()  // Add this to accept User ID
        @IsNotEmpty()
        creator: string;  // User's ID
    
        
}