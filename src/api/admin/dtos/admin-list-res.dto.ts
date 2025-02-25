import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Admin } from 'src/models/Admin/Admin.model';

export class LoginResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  token: string;

  @IsNumber()
  statusCode: number;

  user: Admin;
}
