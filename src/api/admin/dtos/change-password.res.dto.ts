import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ChangePasswordResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsNumber()
  statusCode: number;
}
