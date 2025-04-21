import { Test, TestingModule } from '@nestjs/testing';
import { NoticesService } from './notices.service';

describe('NoticesService', () => {
  let service: NoticesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticesService],
    }).compile();

    service = module.get<NoticesService>(NoticesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
