import { Body, Controller, Post } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dtos/employee.dto';

import { Employee } from 'generated/prisma';
import { ApiResponseType } from 'src/common/types/api-response.type';

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
}
