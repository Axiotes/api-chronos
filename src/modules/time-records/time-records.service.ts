import { Injectable } from '@nestjs/common';

import { TimeRecordsRepository } from './time-records.repository';

@Injectable()
export class TimeRecordsService {
  constructor(private readonly timeRecordsRepository: TimeRecordsRepository) {}
}
