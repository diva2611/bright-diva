import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Currency } from '../../../common/enum/currency.enum';
import { Transform } from 'class-transformer';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @IsNotEmpty()
  @IsString()
  customerId!: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  totalUnits!: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  invoiceDate: Date;

  @IsEnum(Currency)
  currency: Currency;
}
