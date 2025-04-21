import { Test, TestingModule } from '@nestjs/testing';
import { MediasController } from './medias.controller';

describe('MediasController', () => {
  let controller: MediasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediasController],
    }).compile();

    controller = module.get<MediasController>(MediasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
