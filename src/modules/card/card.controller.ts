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
  ApiQuery,
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
  @ApiOperation({
    summary: 'Listar cartões',
    description:
      'Retorna uma lista de cartões com paginação e possibilidade de filtros por funcionário e status do cartão. ' +
      'Também é possível selecionar quais campos devem ser retornados na resposta.',
  })
  @ApiQuery({
    name: 'skip',
    required: true,
    type: Number,
    example: 0,
    description: 'Quantidade de registros a pular (para paginação).',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    example: 10,
    description: 'Quantidade máxima de registros retornados (para paginação).',
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    type: Number,
    example: 12,
    description: 'Filtra os cartões de um funcionário específico pelo ID.',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    example: true,
    description: 'Filtra os cartões pelo status ativo/inativo.',
  })
  @ApiQuery({
    name: 'fields',
    required: false,
    type: [String],
    example: ['id', 'employeeId', 'active'],
    description:
      'Lista opcional de campos a serem retornados na resposta, separados por vírgula. ' +
      'Campos permitidos: id, employeeId, active.',
  })
  @ApiOkResponse({
    description: 'Lista de cartões retornada com sucesso.',
    schema: {
      example: {
        data: [
          { id: 34, employeeId: 12, active: false },
          { id: 35, employeeId: 15, active: true },
        ],
        pagination: { skip: 0, limit: 10 },
        total: 2,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros inválidos ou incorretos.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
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
  @ApiOperation({
    summary: 'Ativar cartão de um funcionário',
    description:
      'Ativa o cartão de um funcionário específico pelo ID do funcionário. ' +
      'O cartão deve estar previamente cadastrado.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    example: 12,
    description: 'ID do funcionário que terá o cartão ativado.',
  })
  @ApiOkResponse({
    description: 'Cartão ativado com sucesso.',
    schema: {
      example: {
        data: {
          id: 34,
          employeeId: 12,
          active: true,
        },
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
  @ApiConflictResponse({
    description: 'O funcionário não possui cartão cadastrado para ativação.',
    schema: {
      example: {
        statusCode: 409,
        message: "Employee with ID 12 doesn't have any card to activate",
        error: 'Conflict',
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
