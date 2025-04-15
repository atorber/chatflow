import { Test, TestingModule } from '@nestjs/testing';
import { QasService } from './qas.service';

describe('QasService', () => {
  let service: QasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QasService],
    }).compile();

    service = module.get<QasService>(QasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
