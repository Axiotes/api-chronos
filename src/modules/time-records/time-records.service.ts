import { Injectable } from '@nestjs/common';
import { TimeRecords } from '@prisma/client';

import { TimeRecordsRepository } from './time-records.repository';

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

    console.log(lastTimeRecord?.type);

    if (!lastTimeRecord || lastTimeRecord.type === 'EXIT') {
      newType = TimeRecordsTypeEnum.ARRIVAL;
    }

    return await this.timeRecordsRepository.create({
      employeeId,
      type: newType,
      dateTime: nowInBrazil,
    });
  }
}
