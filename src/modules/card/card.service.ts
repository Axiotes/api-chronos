import { ConflictException, Injectable } from '@nestjs/common';
import { Cards } from '@prisma/client';

import { EmployeeService } from '../employee/employee.service';

import { CardRepository } from './card.repository';

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

  public async activate(employeeId: number): Promise<Cards> {
    await this.employeeService.findById(employeeId);

    const card = await this.cardRepository.findOne({ employeeId }, true);

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
}
