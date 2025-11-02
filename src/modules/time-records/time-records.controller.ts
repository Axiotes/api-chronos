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
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { TimeRecordsService } from './time-records.service';
import { FindAllTimeRecordsDto } from './dtos/find-all-time-records.dto';

import { ApiResponseType } from 'src/common/types/api-response.type';
import { buildSelectObject } from 'src/common/helpers/build-select-object.helper';

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
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<TimeRecords>> {
    const timeRecord = await this.timeRecordsService.findById(id);

    return {
      data: timeRecord,
    };
  }

  @Get()
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
