import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateOrderResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
