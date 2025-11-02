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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
  @ApiOperation({
    summary: 'Buscar funcionário por ID',
    description: `Endpoint responsável por buscar um funcionário específico pelo seu ID.  
      É possível também informar, através do parâmetro de consulta \`fields\`,  
      quais campos devem ser retornados na resposta. Por exemplo, para retornar apenas o id, nome e cpf do funcionário:
      
      \`GET /employee/1?fields=id,name,cpf\`  
    `,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID numérico do funcionário a ser buscado.',
    required: true,
  })
  @ApiOkResponse({
    description: 'Funcionário encontrado com sucesso.',
    schema: {
      example: {
        statusCode: 200,
        data: {
          id: 1,
          name: 'João da Silva',
          cpf: '12345678901',
          arrivalTime: '08:00',
          exitTime: '17:30',
          created_at: '2025-11-02T18:30:00.000Z',
          updated_at: null,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: `Erro de requisição inválida.  
      Pode ocorrer se o ID não for numérico ou se o formato do parâmetro \`fields\` estiver incorreto.`,
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Funcionário não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Employee with ID "1" not found',
        error: 'Not Found',
      },
    },
  })
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
  @ApiOperation({
    summary: 'Listar funcionários',
    description: `Endpoint responsável por listar os funcionários cadastrados no sistema.  
      Permite paginação, filtros e seleção de campos específicos. Exemplos de uso:]

      - \`GET /employee?skip=0&limit=10\` → Lista os 10 primeiros funcionários  
      - \`GET /employee?name=joão&skip=0&limit=5\` → Busca funcionários cujo nome contenha "joão"  
      - \`GET /employee?fields=id,name,cpf&skip=0&limit=10\` → Retorna apenas os campos informados
    `,
  })
  @ApiQuery({
    name: 'skip',
    required: true,
    type: Number,
    example: 0,
    description:
      'Número de registros a serem ignorados (para paginação). Deve ser >= 0.',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    example: 10,
    description:
      'Quantidade máxima de registros a serem retornados. Deve ser >= 1.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    example: 'João',
    description:
      'Filtra funcionários cujo nome contenha o valor informado (case insensitive).',
  })
  @ApiQuery({
    name: 'cpf',
    required: false,
    type: String,
    example: '12345678901',
    description: 'Filtra funcionários com o CPF exato informado (11 dígitos).',
  })
  @ApiQuery({
    name: 'arrivalTime',
    required: false,
    type: String,
    example: '08:00',
    description:
      'Filtra funcionários cujo horário de entrada contenha o valor informado (formato HH:MM).',
  })
  @ApiQuery({
    name: 'exitTime',
    required: false,
    type: String,
    example: '17:30',
    description:
      'Filtra funcionários cujo horário de saída contenha o valor informado (formato HH:MM).',
  })
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    isArray: true,
    example: ['id', 'name', 'cpf'],
    description: `Lista opcional de campos a serem retornados, separados por vírgula.  
    Campos permitidos: id, name, cpf, email, arrivalTime, exitTime, created_at, updated_at.`,
    style: 'form',
    explode: false,
  })
  @ApiOkResponse({
    description: 'Lista de funcionários retornada com sucesso.',
    schema: {
      example: {
        statusCode: 200,
        data: [
          {
            id: 1,
            name: 'João da Silva',
            cpf: '12345678901',
            email: 'joao@email.com',
            arrivalTime: '08:00',
            exitTime: '17:30',
            created_at: '2025-11-02T18:30:00.000Z',
            updated_at: null,
          },
          {
            id: 2,
            name: 'Maria Souza',
            cpf: '98765432100',
            email: 'maria@email.com',
            arrivalTime: '09:00',
            exitTime: '18:00',
            created_at: '2025-11-01T17:20:00.000Z',
            updated_at: null,
          },
        ],
        pagination: {
          skip: 0,
          limit: 10,
        },
        total: 2,
      },
    },
  })
  @ApiBadRequestResponse({
    description: `Erro de validação nos parâmetros da requisição.  
      Pode ocorrer se os parâmetros de paginação não forem numéricos,  
      ou se os horários estiverem em formato incorreto.`,
    schema: {
      example: {
        statusCode: 400,
        message: [
          'skip must not be less than 0',
          'arrivalTime must be in HH:MM format',
        ],
        error: 'Bad Request',
      },
    },
  })
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
