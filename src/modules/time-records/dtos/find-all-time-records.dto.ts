import { IntersectionType } from '@nestjs/mapped-types';

import { FindTimeRecordsDto } from './find-time-records.dto';

import { SelectFieldsDto } from 'src/common/dtos/select-fields.dto';

export class FindAllTimeRecordsDto extends IntersectionType(
  FindTimeRecordsDto,
  SelectFieldsDto,
) {}
