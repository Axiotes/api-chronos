import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class FindCardDto {
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
  @Transform(({ value }) => value === 'true')
  active?: boolean;
}
