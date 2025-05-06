import { IsMongoId, IsNumber, Min, Max } from 'class-validator';

export class RateEpisodeDto {
  @IsMongoId()
  episodeId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  value: number;
}
