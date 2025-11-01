import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<Cards>> {
    const card = await this.cardService.findById(id);

    return {
      data: card,
    };
  }

  @Patch('activate/employee/:id')
  public async activate(
    @Param('id', ParseIntPipe) employeeId: number,
  ): Promise<ApiResponseType<Cards>> {
    const card = await this.cardService.activate(employeeId);

    return {
      data: card,
    };
  }

  @Delete('employee/:id')
  public async delete(
    @Param('id', ParseIntPipe) employeeId: number,
  ): Promise<ApiResponseType<string>> {
    const card = await this.cardService.delete(employeeId);

    return {
      data: card,
    };
  }
}
