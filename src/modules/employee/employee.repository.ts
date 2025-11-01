import { Injectable } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';

import { EmployeeDto } from './dtos/employee.dto';

import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(employee: EmployeeDto): Promise<Employee> {
    return await this.prisma.employee.create({ data: employee });
  }

  public async findByCpf<T extends Prisma.EmployeeSelect>(
    cpf: string,
    select?: T,
  ): Promise<Prisma.EmployeeGetPayload<{ select?: T }> | null> {
    return this.prisma.employee.findUnique({
      where: { cpf },
      select,
    });
  }

  public async findById<T extends Prisma.EmployeeSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.EmployeeGetPayload<{ select?: T }> | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      select,
    });
  }

  public async findAll<T extends Prisma.EmployeeSelect>(
    skip: number,
    limit: number,
    where: Prisma.EmployeeWhereInput = {},
    select?: T,
  ): Promise<Prisma.EmployeeGetPayload<{ select?: T }>[]> {
    return this.prisma.employee.findMany({
      where,
      skip,
      take: limit,
      select,
    });
  }

  public async update(
    id: number,
    employee: Partial<Employee>,
  ): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: employee,
    });
  }

  public async delete(id: number): Promise<Employee> {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
