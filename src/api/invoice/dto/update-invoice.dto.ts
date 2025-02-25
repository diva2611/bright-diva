import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Currency } from '../../../common/enum/currency.enum';
import { Transform } from 'class-transformer';

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  readonly customerId?: string;

  @IsNumber()
  @IsOptional()
  readonly amount?: number;

  @IsEnum(Currency)
  @IsOptional()
  readonly currency?: Currency;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  readonly invoiceDate?: Date;

  @IsNumber()
  @IsOptional()
  totalUnits?: number;
}
