import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Cards } from '@prisma/client';

import { CardService } from './card.service';

import { ApiResponseType } from 'src/common/types/api-response.type';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('employee/:id')
  public async create(
    @Param('id', ParseIntPipe) employeeId: number,
  ): Promise<ApiResponseType<Cards>> {
    const card = await this.cardService.create(employeeId);

    return {
      data: card,
    };
  }
}
