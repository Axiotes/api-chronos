import { Test, TestingModule } from '@nestjs/testing';

import { TimeRecordsController } from './time-records.controller';

describe('TimeRecordsController', () => {
  let controller: TimeRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeRecordsController],
    }).compile();

    controller = module.get<TimeRecordsController>(TimeRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
