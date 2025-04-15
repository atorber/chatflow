import { Test, TestingModule } from '@nestjs/testing';
import { CarpoolingsService } from './carpoolings.service';

describe('CarpoolingsService', () => {
  let service: CarpoolingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarpoolingsService],
    }).compile();

    service = module.get<CarpoolingsService>(CarpoolingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
