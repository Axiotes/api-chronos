import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Employee } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dtos/employee.dto';
import { FindAllEmployeeDto } from './dtos/find-all-employees.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

import { ApiResponseType } from 'src/common/types/api-response.type';
import { SelectFieldsDto } from 'src/common/dtos/select-fields.dto';
import { buildSelectObject } from 'src/common/helpers/build-select-object.helper';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar novo funcionário',
    description: `Endpoint responsável por cadastrar um novo funcionário no sistema de ponto eletrônico.  
      O cadastro exige informações básicas como nome, CPF, horário de entrada e horário de saída.  
      O CPF deve ser único, se já existir no banco de dados, será retornado um erro de conflito (409).
    `,
  })
  @ApiBody({
    description: 'Dados necessários para o cadastro de um funcionário.',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'João da Silva',
          description: 'Nome completo do funcionário (máximo 150 caracteres).',
        },
        cpf: {
          type: 'string',
          example: '12345678901',
          description:
            'CPF do funcionário com exatamente 11 dígitos numéricos (sem pontos ou traços).',
        },
        arrivalTime: {
          type: 'string',
          example: '08:00',
          description: 'Horário de entrada no formato HH:MM (24h).',
        },
        exitTime: {
          type: 'string',
          example: '17:30',
          description: 'Horário de saída no formato HH:MM (24h).',
        },
      },
      required: ['name', 'cpf', 'arrivalTime', 'exitTime'],
    },
  })
  @ApiCreatedResponse({
    description: 'Funcionário cadastrado com sucesso.',
    schema: {
      example: {
        statusCode: 201,
        data: {
          id: 1,
          name: 'João da Silva',
          cpf: '12345678901',
          arrivalTime: '08:00',
          exitTime: '17:30',
          createdAt: '2025-11-02T18:30:00.000Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: `Erro de validação.  
      Pode ocorrer se algum campo obrigatório estiver ausente, se o formato do horário estiver incorreto,  
      ou se o CPF não tiver exatamente 11 dígitos.`,
    schema: {
      example: {
        statusCode: 400,
        message: [
          'cpf must be longer than or equal to 11 characters',
          'arrivalTime must be in HH:MM format',
          'exitTime must be in HH:MM format',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: `Conflito: já existe um funcionário cadastrado com o mesmo CPF.`,
    schema: {
      example: {
        statusCode: 409,
        message: 'Employee with the CPF "12345678901" already exists',
        error: 'Conflict',
      },
    },
  })
  public async create(
    @Body() employeeDto: EmployeeDto,
  ): Promise<ApiResponseType<Employee>> {
    const employee = await this.employeeService.create(employeeDto);

    return { data: employee };
  }

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: SelectFieldsDto,
  ): Promise<ApiResponseType<Employee>> {
    const fields = query.fields ?? [];
    const allowed = [
      'id',
      'name',
      'cpf',
      'arrivalTime',
      'exitTime',
      'created_at',
      'updated_at',
    ];

    const select = buildSelectObject(fields, allowed);

    const employee = await this.employeeService.findById(id, select);

    return { data: employee };
  }

  @Get()
  public async findAll(
    @Query() query: FindAllEmployeeDto,
  ): Promise<ApiResponseType<Employee[]>> {
    const fields = query.fields ?? [];
    const allowed = [
      'id',
      'name',
      'cpf',
      'email',
      'arrivalTime',
      'exitTime',
      'created_at',
      'updated_at',
    ];

    const select = buildSelectObject(fields, allowed);

    const employees = await this.employeeService.findAll(query, select);

    return {
      data: employees,
      pagination: { skip: query.skip, limit: query.limit },
      total: employees.length,
    };
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<ApiResponseType<Employee>> {
    const employee = await this.employeeService.update(id, updateEmployeeDto);

    return { data: employee };
  }

  @Delete(':id')
  public async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseType<string>> {
    const card = await this.employeeService.delete(id);

    return {
      data: card,
    };
  }
}
