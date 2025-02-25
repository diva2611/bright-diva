import { IsBoolean, IsNumber } from 'class-validator';

export class DeleteCashResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
