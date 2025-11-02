import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TimeRecords } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { TimeRecordsService } from './time-records.service';
import { FindAllTimeRecordsDto } from './dtos/find-all-time-records.dto';

import { ApiResponseType } from 'src/common/types/api-response.type';
import { buildSelectObject } from 'src/common/helpers/build-select-object.helper';
import { TimeRecordsTypeEnum } from 'src/common/enum/time-records-type.enum';

@ApiTags('Time Records')
@Controller('time-records')
export class TimeRecordsController {
  constructor(private readonly timeRecordsService: TimeRecordsService) {}

  @Post('employee/:id')
  @ApiOperation({
    summary: 'Registrar entrada ou saída de funcionário',
    description:
      'Este endpoint registra automaticamente a entrada ou saída de um funcionário com base no último registro do dia. ' +
      'Se o último registro for uma saída ou inexistente, é registrada uma entrada; caso contrário, uma saída.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 12,
    description: 'ID do funcionário a ser registrado.',
  })
  @ApiCreatedResponse({
    description:
      'Registro criado com sucesso. Retorna os dados do registro de ponto.',
    schema: {
      example: {
        statusCode: 201,
        data: {
          id: 45,
          employeeId: 12,
          dateTime: '2025-11-02T08:30:00.000Z',
          type: 'ARRIVAL',
          createdAt: '2025-11-02T08:30:01.123Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Requisição inválida (ex: ID inválido ou dados incorretos).',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid employee ID',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Funcionário não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Employee not found',
        error: 'Not Found',
      },
    },
  })
  public async create(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<TimeRecords>> {
    const timeRecord = await this.timeRecordsService.create(id);

    return {
      data: timeRecord,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar registro de entrada ou saída de funcionário por ID',
    description:
      'Retorna os detalhes de um registro específico de ponto de um funcionário, identificado pelo ID do registro.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    example: 45,
    description: 'Identificador único do registro de ponto.',
  })
  @ApiOkResponse({
    description: 'Registro de ponto encontrado com sucesso.',
    schema: {
      example: {
        statusCode: 200,
        data: {
          id: 45,
          employeeId: 12,
          dateTime: '2025-11-02T08:30:00.000Z',
          type: 'ARRIVAL',
          createdAt: '2025-11-02T08:30:01.123Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Registro de ponto não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Time record with ID "45" not found',
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
  ): Promise<ApiResponseType<TimeRecords>> {
    const timeRecord = await this.timeRecordsService.findById(id);

    return {
      data: timeRecord,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar registros de entrada/saída de funcionários',
    description:
      'Retorna uma lista de registros de ponto de funcionários, com suporte a filtros por funcionário ou tipo de registro e paginações.',
  })
  @ApiQuery({
    name: 'skip',
    required: true,
    type: Number,
    description: 'Número de registros a serem pulados (para paginação).',
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Quantidade máxima de registros a serem retornados.',
    example: 10,
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    type: Number,
    description: 'Filtra os registros de um funcionário específico pelo ID.',
    example: 12,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: TimeRecordsTypeEnum,
    description: 'Filtra registros por tipo: ARRIVAL ou EXIT.',
    example: TimeRecordsTypeEnum.ARRIVAL,
  })
  @ApiQuery({
    name: 'fields',
    required: false,
    type: [String],
    description:
      'Lista opcional de campos a serem retornados, separados por vírgula. Campos permitidos: id, employeeId, type, created_at, updated_at.',
    example: ['id', 'employeeId', 'type'],
  })
  @ApiOkResponse({
    description: 'Lista de registros retornada com sucesso.',
    schema: {
      example: {
        statusCode: 200,
        data: [
          {
            id: 45,
            employeeId: 12,
            type: 'ARRIVAL',
            createdAt: '2025-11-02T08:30:01.123Z',
            updatedAt: null,
          },
          {
            id: 46,
            employeeId: 12,
            type: 'EXIT',
            createdAt: '2025-11-02T17:05:01.123Z',
            updatedAt: null,
          },
        ],
        pagination: { skip: 0, limit: 10 },
        total: 2,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros inválidos ou erro de validação.',
    schema: {
      example: {
        statusCode: 400,
        message:
          'Validation failed (numeric string is expected for skip/limit)',
        error: 'Bad Request',
      },
    },
  })
  public async findAll(
    @Query() query: FindAllTimeRecordsDto,
  ): Promise<ApiResponseType<TimeRecords[]>> {
    const fields = query.fields ?? [];
    const allowed = ['id', 'employeeId', 'type', 'created_at', 'updated_at'];

    const select = buildSelectObject(fields, allowed);

    const employees = await this.timeRecordsService.findAll(query, select);

    return {
      data: employees,
      pagination: { skip: query.skip, limit: query.limit },
      total: employees.length,
    };
  }
}
