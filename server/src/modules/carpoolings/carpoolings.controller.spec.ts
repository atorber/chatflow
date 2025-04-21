import { Test, TestingModule } from '@nestjs/testing';
import { CarpoolingsController } from './carpoolings.controller';

describe('CarpoolingsController', () => {
  let controller: CarpoolingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarpoolingsController],
    }).compile();

    controller = module.get<CarpoolingsController>(CarpoolingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
