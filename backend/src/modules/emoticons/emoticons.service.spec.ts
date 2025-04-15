import { Test, TestingModule } from '@nestjs/testing';
import { EmoticonsService } from './emoticons.service';

describe('EmoticonsService', () => {
  let service: EmoticonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmoticonsService],
    }).compile();

    service = module.get<EmoticonsService>(EmoticonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
