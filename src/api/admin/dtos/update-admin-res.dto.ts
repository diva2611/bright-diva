import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateAdminResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
