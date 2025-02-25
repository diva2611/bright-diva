import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Currency } from '../../../common/enum/currency.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNumber()
  amountOfDelivery: number;

  @IsBoolean()
  partialDelivery: boolean;

  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  deliveredUnits: number;
}
