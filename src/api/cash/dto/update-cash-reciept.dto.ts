import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateCashResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
