import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Cards } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CardService } from './card.service';
import { FindAllCardsDto } from './dtos/find-all-cards.dto';

import { ApiResponseType } from 'src/common/types/api-response.type';
import { buildSelectObject } from 'src/common/helpers/build-select-object.helper';

@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('employee/:id')
  @ApiOperation({
    summary: 'Cadastrar cartão para um funcionário',
    description:
      'Cria um novo cartão para o funcionário identificado pelo ID. ' +
      'Apenas um cartão pode estar ativo por vez. Se o funcionário já possuir um cartão, o endpoint retorna um erro.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    example: 12,
    description: 'ID do funcionário que receberá o cartão.',
  })
  @ApiCreatedResponse({
    description: 'Cartão criado com sucesso.',
    schema: {
      example: {
        data: {
          id: 34,
          employeeId: 12,
          active: false,
          createdAt: '2025-11-02T08:30:01.123Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiConflictResponse({
    description:
      'Já existe um cartão não atribuído ou o funcionário já possui um cartão ativo.',
    schema: {
      example: {
        statusCode: 409,
        message: 'The employee John already has a card.',
        error: 'Conflict',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Funcionário não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Employee with ID "12" not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido ou parâmetro incorreto.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  public async create(
    @Param('id', ParseIntPipe) employeeId: number,
  ): Promise<ApiResponseType<Cards>> {
    const card = await this.cardService.create(employeeId);

    return {
      data: card,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar cartão por ID',
    description:
      'Retorna os detalhes de um cartão específico, identificado pelo ID do cartão.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    example: 34,
    description: 'Identificador único do cartão.',
  })
  @ApiOkResponse({
    description: 'Cartão encontrado com sucesso.',
    schema: {
      example: {
        data: {
          id: 34,
          employeeId: 12,
          active: false,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Cartão não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Card not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido ou parâmetro incorreto.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<Cards>> {
    const card = await this.cardService.findById(id);

    return {
      data: card,
    };
  }

  @Get()
  public async findAll(
    @Query() query: FindAllCardsDto,
  ): Promise<ApiResponseType<Cards[]>> {
    const fields = query.fields ?? [];
    const allowed = ['id', 'employeeId', 'active'];

    const select = buildSelectObject(fields, allowed);

    const employees = await this.cardService.findAll(query, select);

    return {
      data: employees,
      pagination: { skip: query.skip, limit: query.limit },
      total: employees.length,
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
