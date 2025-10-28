import { Test, TestingModule } from '@nestjs/testing';

import { TimeRecordsService } from './time-records.service';

describe('TimeRecordsService', () => {
  let service: TimeRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeRecordsService],
    }).compile();

    service = module.get<TimeRecordsService>(TimeRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
