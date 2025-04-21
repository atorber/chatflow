import { Test, TestingModule } from '@nestjs/testing';
import { MagicService } from './magic.service';

describe('MagicService', () => {
  let service: MagicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagicService],
    }).compile();

    service = module.get<MagicService>(MagicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
