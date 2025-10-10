import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EmployeeRepository } from './employee.repository';
import { EmployeeDto } from './dtos/employee.dto';
import { FindEmployeeDto } from './dtos/find-employee.dto';

import { Employee, Prisma } from 'generated/prisma';

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

  public async findById(
    id: number,
    select?: Prisma.EmployeeSelect,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id, select);

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    return employee;
  }

  public async findAll(
    findEmployeeDto: FindEmployeeDto,
    select?: Prisma.EmployeeSelect,
  ): Promise<Employee[]> {
    let where = {};

    const filters: { [K in keyof FindEmployeeDto]?: () => void } = {
      cpf: () => (where = { ...where, cpf: findEmployeeDto.cpf }),
      name: () =>
        (where = {
          ...where,
          name: { contains: findEmployeeDto.name, mode: 'insensitive' },
        }),
      arrivalTime: () =>
        (where = {
          ...where,
          arrivalTime: {
            contains: findEmployeeDto.arrivalTime,
            mode: 'insensitive',
          },
        }),
      exitTime: () =>
        (where = {
          ...where,
          exitTime: {
            contains: findEmployeeDto.exitTime,
            mode: 'insensitive',
          },
        }),
    };

    for (const key in findEmployeeDto) {
      if (key === 'skip' || key === 'limit') continue;

      const func = filters[key];

      if (func) func();
    }

    return await this.employeeRepository.findAll(
      findEmployeeDto.skip,
      findEmployeeDto.limit,
      where,
      select,
    );
  }
}
