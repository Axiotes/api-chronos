import { IntersectionType } from '@nestjs/mapped-types';

import { FindEmployeeDto } from './find-employee.dto';

import { SelectFieldsDto } from 'src/common/dtos/select-fields.dto';

export class FindAllEmployeeDto extends IntersectionType(
  FindEmployeeDto,
  SelectFieldsDto,
) {}
