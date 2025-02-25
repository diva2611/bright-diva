import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateInvoiceResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
