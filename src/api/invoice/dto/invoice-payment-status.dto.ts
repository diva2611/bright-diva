import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Cash } from 'src/models/Cash/Cash.model';
import { Invoice } from 'src/models/Invoice/Invoice.model';

export class InvoicePaymentStatusDto {
  @IsString()
  invoiceNumber: string;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  amountPaid: number;

  @IsNumber()
  remainingAmount: number;

  @IsBoolean()
  isFullyPaid: boolean;

  invoiceData: Invoice;

  cashData: Cash[];

  @IsNumber()
  statusCode: number;
}
