import { Module } from '@nestjs/common';

import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';

import { ServicesModule } from 'src/common/services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [CardService, CardRepository],
  controllers: [CardController],
})
export class CardModule {}
