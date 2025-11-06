import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindEmployeeDto {
  @ApiProperty({
    description: 'Número de registros a pular (para paginação). Deve ser >= 0.',
    example: 0,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  skip: number;

  @ApiProperty({
    description: 'Quantidade máxima de registros a retornar. Deve ser >= 1.',
    example: 10,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiPropertyOptional({
    description: 'Filtra funcionários pelo CPF (11 dígitos).',
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Filtra pelo horário de entrada (formato HH:MM).',
    example: '08:00',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'arrival time must be in HH:MM format',
  })
  arrivalTime?: string;

  @ApiPropertyOptional({
    description: 'Filtra pelo horário de saída (formato HH:MM).',
    example: '17:30',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'exit time must be in HH:MM format',
  })
  exitTime?: string;
}
