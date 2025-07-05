import { IsBoolean, IsNumber } from 'class-validator';

export class DeleteUserResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
