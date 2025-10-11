import { Injectable } from '@nestjs/common';
import { Prisma, TimeRecords } from '@prisma/client';

import { TimeRecordsTypeEnum } from 'src/common/enum/time-records-type.enum';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Injectable()
export class TimeRecordsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(timeRecords: {
    employeeId: number;
    type: TimeRecordsTypeEnum;
    dateTime: Date;
  }): Promise<TimeRecords> {
    return await this.prisma.timeRecords.create({ data: timeRecords });
  }

  public async findLastEmployeeRecord<T extends Prisma.TimeRecordsSelect>(
    employeeId: number,
    date: Date,
    select?: T,
  ): Promise<Prisma.TimeRecordsGetPayload<{ select?: T }> | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.timeRecords.findFirst({
      where: {
        employeeId,
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select,
      orderBy: {
        dateTime: 'asc',
      },
    });
  }
}
