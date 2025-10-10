import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';

import { HourConstraint } from 'src/common/validators/hour.validator';

export class EmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'arrival time must be in HH:MM format',
  })
  @Validate(HourConstraint)
  arrivalTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'arrival time must be in HH:MM format',
  })
  @Validate(HourConstraint)
  exitTime: string;
}
