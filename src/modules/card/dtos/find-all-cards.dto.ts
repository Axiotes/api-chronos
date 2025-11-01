import { IntersectionType } from '@nestjs/mapped-types';

import { FindCardDto } from './find-card.dto';

import { SelectFieldsDto } from 'src/common/dtos/select-fields.dto';

export class FindAllCardsDto extends IntersectionType(
  FindCardDto,
  SelectFieldsDto,
) {}
