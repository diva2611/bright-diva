import { IsNumber } from 'class-validator';
import { Invoice } from 'src/models/Invoice/Invoice.model';

export class Invoices {
  invoice: Invoice;

  @IsNumber()
  totalPaidAmount: number;

  @IsNumber()
  remainingAmount: number;
}

export class InvoiceListResDto {
  invoices: Invoices[];

  @IsNumber()
  total: number;

  @IsNumber()
  statusCode: number;
}
