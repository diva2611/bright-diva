import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCashResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
