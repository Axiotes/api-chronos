import { PartialType } from '@nestjs/mapped-types';

import { EmployeeDto } from './employee.dto';

export class UpdateEmployeeDto extends PartialType(EmployeeDto) {}
