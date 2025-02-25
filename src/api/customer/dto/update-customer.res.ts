import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateCustomerResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
