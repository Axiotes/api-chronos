import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TimeRecords } from '@prisma/client';

import { TimeRecordsService } from './time-records.service';
import { FindAllTimeRecordsDto } from './dtos/find-all-time-records.dto';

import { ApiResponseType } from 'src/common/types/api-response.type';
import { buildSelectObject } from 'src/common/helpers/build-select-object.helper';

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

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<TimeRecords>> {
    const timeRecord = await this.timeRecordsService.findById(id);

    return {
      data: timeRecord,
    };
  }

  @Get()
  public async findAll(
    @Query() query: FindAllTimeRecordsDto,
  ): Promise<ApiResponseType<TimeRecords[]>> {
    const fields = query.fields ?? [];
    const allowed = ['id', 'employeeId', 'type', 'created_at', 'updated_at'];

    const select = buildSelectObject(fields, allowed);

    const employees = await this.timeRecordsService.findAll(query, select);

    return {
      data: employees,
      pagination: { skip: query.skip, limit: query.limit },
      total: employees.length,
    };
  }
}
