import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Currency } from '../../../common/enum/currency.enum';

export class UpdateCashDto {
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsBoolean()
  @IsOptional()
  partialDelivery?: boolean;

  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  cashPickupDate?: Date;

  @IsString()
  @IsOptional()
  pickupTime?: string;

  @IsOptional()
  @IsString()
  pickedBy?: string;

  @IsOptional()
   @IsEnum(Currency)
    currency?: Currency;
}
