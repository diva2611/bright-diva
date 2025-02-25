import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { FilterType } from '../enum/filter-type.enum';
import { Type } from 'class-transformer';

export class FilterQueryDto {
  @IsEnum(FilterType)
  @IsOptional()
  type?: FilterType;

  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
