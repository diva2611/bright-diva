import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateInvoiceResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
