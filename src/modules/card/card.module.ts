import { Module } from '@nestjs/common';

import { EmployeeModule } from '../employee/employee.module';

import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';

import { ServicesModule } from 'src/common/services/services.module';

@Module({
  imports: [ServicesModule, EmployeeModule],
  providers: [CardService, CardRepository],
  controllers: [CardController],
})
export class CardModule {}
