import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class GenerateMisReportResDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  url!: string;

  @IsNumber()
  statusCode: number;
}
