import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cards, Prisma } from '@prisma/client';

import { EmployeeService } from '../employee/employee.service';

import { CardRepository } from './card.repository';
import { FindCardDto } from './dtos/find-card.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly employeeService: EmployeeService,
  ) {}

  public async create(employeeId: number): Promise<Cards> {
    await this.employeeService.findById(employeeId);

    const card = await this.cardRepository.findOne({ active: false }, true);

    if (card) {
      const employeeFirstName = card.employee?.name.split(' ')[0];

      throw new ConflictException(
        `Only one card can be registered at a time. Assign ${employeeFirstName}'s card to him or delete it.`,
      );
    }

    const employeeCard = await this.cardRepository.findOne(
      { employeeId },
      true,
    );

    if (employeeCard) {
      const employeeFirstName = employeeCard.employee?.name.split(' ')[0];

      throw new ConflictException(
        `The employee ${employeeFirstName} already has a card.`,
      );
    }

    return await this.cardRepository.create(employeeId);
  }

  public async findById(
    id: number,
    select?: Prisma.CardsSelect,
  ): Promise<Cards> {
    const card = await this.cardRepository.findById(id, select);

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  public async findAll(
    findEmployeeDto: FindCardDto,
    select?: Prisma.CardsSelect,
  ): Promise<Cards[]> {
    let where = {};

    const filters: { [K in keyof FindCardDto]?: () => void } = {
      employeeId: () =>
        (where = { ...where, employeeId: findEmployeeDto.employeeId }),
      active: () => (where = { ...where, active: findEmployeeDto.active }),
    };

    for (const key in findEmployeeDto) {
      if (key === 'skip' || key === 'limit') continue;

      const func = filters[key];

      if (func) func();
    }

    return await this.cardRepository.findAll(
      findEmployeeDto.skip,
      findEmployeeDto.limit,
      where,
      select,
    );
  }

  public async activate(employeeId: number): Promise<Cards> {
    await this.employeeService.findById(employeeId);

    const card = await this.cardRepository.findOne({ employeeId }, false);

    if (!card || card === null) {
      throw new ConflictException(
        `Employee with ID ${employeeId} doesn't have any card to activate`,
      );
    }

    return await this.cardRepository.update(card.id, {
      employeeId: card.employeeId,
      active: true,
    });
  }

  public async delete(employeeId: number): Promise<string> {
    await this.employeeService.findById(employeeId);

    const card = await this.cardRepository.findOne({ employeeId }, false);

    if (!card || card === null) {
      throw new ConflictException(
        `Employee with ID ${employeeId} doesn't have any card`,
      );
    }

    await this.cardRepository.delete(card.id);

    return `Card with ID ${card.id} deleted`;
  }
}
