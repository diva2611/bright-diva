import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Currency } from '../../../common/enum/currency.enum';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsNumber()
  amountOfDelivery?: number;

  @IsOptional()
  @IsBoolean()
  partialDelivery?: boolean;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsNumber()
  @IsOptional()
  deliveredUnits?: number;

  @IsOptional()
  @IsString()
  deliveredBy?: string;
}
