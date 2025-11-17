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
    return await this.prisma.timeRecords.create({
      data: timeRecords,
      include: {
        employee: true,
      },
    });
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
        dateTime: 'desc',
      },
    });
  }

  public async findById<T extends Prisma.TimeRecordsSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TimeRecordsGetPayload<{ select?: T }> | null> {
    return this.prisma.timeRecords.findUnique({
      where: { id },
      select,
    });
  }

  public async findAll<T extends Prisma.TimeRecordsSelect>(
    skip: number,
    limit: number,
    where: Prisma.TimeRecordsWhereInput = {},
    select?: T,
  ): Promise<Prisma.TimeRecordsGetPayload<{ select?: T }>[]> {
    return this.prisma.timeRecords.findMany({
      where,
      skip,
      take: limit,
      select,
    });
  }
}
