import { IsBoolean, IsNumber } from 'class-validator';

export class DeleteAdminResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
