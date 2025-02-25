import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateCurrencyResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
