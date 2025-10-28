import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TimeRecords } from '@prisma/client';

import { TimeRecordsRepository } from './time-records.repository';
import { FindTimeRecordsDto } from './dtos/find-time-records.dto';

import { TimeRecordsTypeEnum } from 'src/common/enum/time-records-type.enum';

@Injectable()
export class TimeRecordsService {
  constructor(private readonly timeRecordsRepository: TimeRecordsRepository) {}

  public async create(employeeId: number): Promise<TimeRecords> {
    const now = new Date();
    const nowInBrazil = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const lastTimeRecord =
      await this.timeRecordsRepository.findLastEmployeeRecord(
        employeeId,
        nowInBrazil,
        { type: true },
      );

    let newType = TimeRecordsTypeEnum.EXIT;

    if (!lastTimeRecord || lastTimeRecord.type === TimeRecordsTypeEnum.EXIT) {
      newType = TimeRecordsTypeEnum.ARRIVAL;
    }

    return await this.timeRecordsRepository.create({
      employeeId,
      type: newType,
      dateTime: nowInBrazil,
    });
  }

  public async findById(
    id: number,
    select?: Prisma.TimeRecordsSelect,
  ): Promise<TimeRecords> {
    const employee = await this.timeRecordsRepository.findById(id, select);

    if (!employee) {
      throw new NotFoundException(`Time record with ID "${id}" not found`);
    }

    return employee;
  }

  public async findAll(
    findTimeRecordsDto: FindTimeRecordsDto,
    select?: Prisma.TimeRecordsSelect,
  ): Promise<TimeRecords[]> {
    let where = {};

    const filters: { [K in keyof FindTimeRecordsDto]?: () => void } = {
      employeeId: () =>
        (where = { ...where, employeeId: findTimeRecordsDto.employeeId }),
      type: () => (where = { ...where, type: findTimeRecordsDto.type }),
    };

    for (const key in findTimeRecordsDto) {
      if (key === 'skip' || key === 'limit') continue;

      const func = filters[key];

      if (func) func();
    }

    return await this.timeRecordsRepository.findAll(
      findTimeRecordsDto.skip,
      findTimeRecordsDto.limit,
      where,
      select,
    );
  }
}
