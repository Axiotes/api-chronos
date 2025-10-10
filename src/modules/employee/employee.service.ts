import { ConflictException, Injectable } from '@nestjs/common';

import { EmployeeRepository } from './employee.repository';
import { EmployeeDto } from './dtos/employee.dto';

import { Employee } from 'generated/prisma';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  public async create(employee: EmployeeDto): Promise<Employee> {
    const employeeCpf = await this.employeeRepository.findByCpf(employee.cpf, {
      cpf: true,
    });

    if (employeeCpf) {
      throw new ConflictException(
        `Employee with the CPF "${employee.cpf}" already exists`,
      );
    }

    return await this.employeeRepository.create(employee);
  }
}
