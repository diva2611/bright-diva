import { IsBoolean, IsNumber } from 'class-validator';

export class DeleteInvoiceResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  statusCode: number;
}
