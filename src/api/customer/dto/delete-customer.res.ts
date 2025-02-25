import { IsBoolean, IsNumber } from 'class-validator';

export class DeleteCustomerResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
