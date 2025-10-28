import { PrismaClient, TimeRecords } from '@prisma/client';
import { TimeRecordsTypeEnum } from 'src/common/enum/time-records-type.enum';

export const timeRecordsSeeder = async (
  prisma: PrismaClient,
): Promise<void> => {
  let day = 0;

  for (let i = 0; i < 30; i++) {
    const employees = await prisma.employee.findMany();

    if (employees.length === 0) {
      throw new Error('There are no registered employees');
    }

    day++;
    let date = new Date(2025, 9, day);

    if (date.getDay() === 0) {
      day++;

      date = new Date(2025, 9, day);
    }

    await employees.forEach(async (employee) => {
      const arrivalHour = parseInt(employee.arrivalTime.split(':')[0]);
      const arrivalMinute = parseInt(employee.arrivalTime.split(':')[1]);
      const exitHour = parseInt(employee.arrivalTime.split(':')[0]);
      const exitMinute = parseInt(employee.arrivalTime.split(':')[1]);

      const timeRecordArrival = {
        employeeId: employee.id,
        dateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          arrivalHour,
          arrivalMinute,
        ),
        type: TimeRecordsTypeEnum.ARRIVAL,
      } as TimeRecords;
      const timeRecordExit = {
        employeeId: employee.id,
        dateTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          exitHour,
          exitMinute,
        ),
        type: TimeRecordsTypeEnum.ARRIVAL,
      } as TimeRecords;

      await prisma.timeRecords.createMany({
        data: [timeRecordArrival, timeRecordExit],
      });
    });
  }

  console.log('Time Records seeder completed successfully');
};
