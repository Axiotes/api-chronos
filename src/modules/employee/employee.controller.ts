import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dtos/employee.dto';
import { FindAllEmployeeDto } from './dtos/find-all-employees.dto';

import { Employee } from 'generated/prisma';
import { ApiResponseType } from 'src/common/types/api-response.type';
import { SelectFieldsDto } from 'src/common/dtos/select-fields.dto';
import { buildSelectObject } from 'src/common/helpers/build-select-object.helper';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
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
}
