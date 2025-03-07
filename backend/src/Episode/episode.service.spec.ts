import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeService } from '../Episode/episode.service';

describe('EpisodeService', () => {
  let service: EpisodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpisodeService],
    }).compile();

    service = module.get<EpisodeService>(EpisodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
