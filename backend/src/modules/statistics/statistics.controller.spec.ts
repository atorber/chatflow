import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';

describe('StatisticsController', () => {
  let controller: StatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
