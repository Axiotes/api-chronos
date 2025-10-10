import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { EmployeeDto } from 'src/modules/employee/dtos/employee.dto';

@ValidatorConstraint({ async: false })
export class HourConstraint implements ValidatorConstraintInterface {
  public validate(endHour: number, args: ValidationArguments): boolean {
    const obj = args.object as EmployeeDto;
    const start = obj.arrivalTime;
    const end = obj.exitTime;

    return start < end;
  }

  public defaultMessage(): string {
    return 'arrival time must be less than end exit time';
  }
}
