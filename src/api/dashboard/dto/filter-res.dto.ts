import { IsNumber, IsString } from 'class-validator';

export class FilterResponseDto {
  @IsString()
  type: string;

  @IsString()
  dateRange: string;

  data: any;

  @IsNumber()
  statusCode: number;
}
