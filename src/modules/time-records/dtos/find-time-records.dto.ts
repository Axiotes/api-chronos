import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { TimeRecordsTypeEnum } from 'src/common/enum/time-records-type.enum';

export class FindTimeRecordsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  skip: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  employeeId?: number;

  @IsOptional()
  @IsEnum(TimeRecordsTypeEnum)
  type?: TimeRecordsTypeEnum;
}
