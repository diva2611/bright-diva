import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Currency } from '../../../common/enum/currency.enum';

export class CreateCashDto {
  @IsNotEmpty()
  @IsString()
  invoiceNumber!: string;

  @IsBoolean()
  partialDelivery!: boolean;

  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @IsNotEmpty()
  @IsString()
  customerId!: string;

  @IsNumber()
  amount!: number;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  cashPickupDate!: Date;

  @IsNotEmpty()
  @IsString()
  pickupTime!: string;

  @IsNotEmpty()
  @IsString()
  pickedBy!: string;

  @IsEnum(Currency)
  currency: Currency;
}
