import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePodcastDto {
  @IsString()
  @IsNotEmpty()
  podcastName: string;

  @IsString()
  @IsNotEmpty()
  podcastDescription: string;

  @IsString()
  @IsNotEmpty()
  podcastImage: string;

  @IsMongoId({ each: true })
  @IsOptional()
  categories?: string[];
}
