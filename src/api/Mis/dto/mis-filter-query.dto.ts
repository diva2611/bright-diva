import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum MisFilterType {
  INVOICE = 'Invoice',
  ORDER = 'Order',
  CASH = 'Cash',
}

export class MisFilterQueryDto {
  @IsEnum(MisFilterType)
  @IsOptional()
  type?: MisFilterType;

  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;

  @IsString()
  @IsOptional()
  customerId?: string;
}
