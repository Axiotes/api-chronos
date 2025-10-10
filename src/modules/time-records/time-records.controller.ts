import { Controller } from '@nestjs/common';

import { TimeRecordsService } from './time-records.service';

@Controller('time-records')
export class TimeRecordsController {
  constructor(private readonly timeRecordsService: TimeRecordsService) {}
}
