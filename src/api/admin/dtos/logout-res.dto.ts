import { IsBoolean, IsNumber } from 'class-validator';

export class LogoutResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
