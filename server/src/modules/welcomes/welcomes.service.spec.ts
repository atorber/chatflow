import { Test, TestingModule } from '@nestjs/testing';
import { WelcomesService } from './welcomes.service';

describe('WelcomesService', () => {
  let service: WelcomesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WelcomesService],
    }).compile();

    service = module.get<WelcomesService>(WelcomesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
