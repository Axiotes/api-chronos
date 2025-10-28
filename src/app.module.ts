import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './modules/employee/employee.module';
import { ServicesModule } from './common/services/services.module';
import { TimeRecordsModule } from './modules/time-records/time-records.module';

@Module({
  imports: [EmployeeModule, ServicesModule, TimeRecordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
