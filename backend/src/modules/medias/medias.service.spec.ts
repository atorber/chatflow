import { Test, TestingModule } from '@nestjs/testing';
import { MediasService } from './medias.service';

describe('MediasService', () => {
  let service: MediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediasService],
    }).compile();

    service = module.get<MediasService>(MediasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
