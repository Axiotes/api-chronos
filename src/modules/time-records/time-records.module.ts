import { Module } from '@nestjs/common';

import { TimeRecordsService } from './time-records.service';
import { TimeRecordsController } from './time-records.controller';
import { TimeRecordsRepository } from './time-records.repository';

import { ServicesModule } from 'src/common/services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [TimeRecordsService, TimeRecordsRepository],
  controllers: [TimeRecordsController],
})
export class TimeRecordsModule {}
