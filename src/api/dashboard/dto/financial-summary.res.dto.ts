import { IsNumber } from 'class-validator';

export class FinancialSummaryDto {
  @IsNumber()
  totalOrderValue: number;

  @IsNumber()
  totalDeliveredValue: number;

  @IsNumber()
  nonDeliveredValue: number;

  @IsNumber()
  totalNetDue: number;

  @IsNumber()
  deliveredCashPickup: number;

  @IsNumber()
  totalCashPickup: number;

  @IsNumber()
  statusCode: number;

   @IsNumber()
  totalInvoice: number;
}
