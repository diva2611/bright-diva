import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCustomerResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
