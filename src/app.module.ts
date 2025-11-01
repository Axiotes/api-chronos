import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './modules/employee/employee.module';
import { ServicesModule } from './common/services/services.module';
import { TimeRecordsModule } from './modules/time-records/time-records.module';
import { CardModule } from './modules/card/card.module';

@Module({
  imports: [EmployeeModule, ServicesModule, TimeRecordsModule, CardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
