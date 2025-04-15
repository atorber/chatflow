import { Test, TestingModule } from '@nestjs/testing';
import { WhitelistsController } from './whitelists.controller';

describe('WhitelistsController', () => {
  let controller: WhitelistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhitelistsController],
    }).compile();

    controller = module.get<WhitelistsController>(WhitelistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
