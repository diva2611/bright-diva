import { IsOptional } from 'class-validator';

export class UpdateCurrencyDto {
  @IsOptional()
  hkdToMop?: number;

  @IsOptional()
  hkdToCny?: number;
}
