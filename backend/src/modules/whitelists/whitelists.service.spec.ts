import { Test, TestingModule } from '@nestjs/testing';
import { WhitelistsService } from './whitelists.service';

describe('WhitelistsService', () => {
  let service: WhitelistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhitelistsService],
    }).compile();

    service = module.get<WhitelistsService>(WhitelistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
