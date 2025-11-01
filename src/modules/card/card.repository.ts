import { Injectable } from '@nestjs/common';
import { Cards, Employee, Prisma } from '@prisma/client';

import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Injectable()
export class CardRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(employeeId: number): Promise<Cards> {
    return await this.prisma.cards.create({
      data: {
        employeeId,
        active: false,
      },
    });
  }

  public async findAll<T extends Prisma.CardsSelect>(
    skip: number,
    limit: number,
    where: Prisma.CardsWhereInput = {},
    select?: T,
  ): Promise<Prisma.CardsGetPayload<{ select?: T }>[]> {
    return await this.prisma.cards.findMany({
      where,
      skip,
      take: limit,
      select,
    });
  }

  public async findOne(
    where: Prisma.CardsWhereInput,
    includeEmployee: boolean,
  ): Promise<(Cards & { employee?: Employee }) | null> {
    return await this.prisma.cards.findFirst({
      where,
      include: { employee: includeEmployee },
    });
  }

  public async update(id: number, card: Partial<Cards>): Promise<Cards> {
    return this.prisma.cards.update({
      where: { id },
      data: card,
    });
  }

  public async delete(id: number): Promise<Cards> {
    return this.prisma.cards.delete({
      where: { id },
    });
  }
}
