import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateUserResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;

  @IsNumber()
  statusCode: number;
}
