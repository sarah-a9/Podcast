// src/episode/dto/update-episode.dto.ts

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Episodestatus } from '../../schemas/Episode.schema';

export class UpdateEpisodeDto {
  @IsOptional()
  @IsString()
  episodeTitle?: string;

  @IsOptional()
  @IsString()
  episodeDescription?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsEnum(Episodestatus)
  status?: Episodestatus;

  // We accept scheduledAt as a string (ISO) and will parse it into Date in the service
  @IsOptional()
  @IsString()
  scheduledAt?: string;

}
