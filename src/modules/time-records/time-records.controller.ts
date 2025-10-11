import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TimeRecords } from '@prisma/client';

import { TimeRecordsService } from './time-records.service';

import { ApiResponseType } from 'src/common/types/api-response.type';

@Controller('time-records')
export class TimeRecordsController {
  constructor(private readonly timeRecordsService: TimeRecordsService) {}

  @Post('employee/:id')
  public async create(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<TimeRecords>> {
    const timeRecord = await this.timeRecordsService.create(id);

    return {
      data: timeRecord,
    };
  }
}
