import { IsBoolean, IsNumber } from 'class-validator';

export class DeleteOrderResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
