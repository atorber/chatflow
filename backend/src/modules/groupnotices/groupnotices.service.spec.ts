import { Test, TestingModule } from '@nestjs/testing';
import { GroupnoticesService } from './groupnotices.service';

describe('GroupnoticesService', () => {
  let service: GroupnoticesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupnoticesService],
    }).compile();

    service = module.get<GroupnoticesService>(GroupnoticesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
