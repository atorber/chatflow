import { Test, TestingModule } from '@nestjs/testing';
import { GroupnoticesController } from './groupnotices.controller';

describe('GroupnoticesController', () => {
  let controller: GroupnoticesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupnoticesController],
    }).compile();

    controller = module.get<GroupnoticesController>(GroupnoticesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
