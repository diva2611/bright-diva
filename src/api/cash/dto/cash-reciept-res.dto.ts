import { IsEnum, IsNumber, IsString } from 'class-validator';

class CustomerDto {
  @IsString()
  customerName: string;

  @IsString()
  customerContact: string;

  @IsString()
  customerEmail: string;
}

class InvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsString()
  invoiceDate: string;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  paidAmount: number;

  @IsNumber()
  remainingAmount: number;
}

class OrderDto {
  @IsString()
  orderNumber: string;

  @IsNumber()
  orderAmount: number;

  @IsString()
  orderDeliveryStatus: string;
}

class CashReceiptDto {
  @IsString()
  receiptNumber: string;

  @IsString()
  paymentStatus: string;

  @IsNumber()
  paymentAmount: number;

  @IsString()
  paymentDate: string;
}

export class CashReceiptDetailsDto {
  @IsEnum(CustomerDto)
  customer: CustomerDto;

  @IsEnum(InvoiceDto)
  invoice: InvoiceDto;

  @IsEnum(OrderDto)
  order: OrderDto;

  cashReceipts: CashReceiptDto[];
}
