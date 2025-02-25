import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateOrderResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
