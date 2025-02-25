import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../../common/enum/role.enum';

export class UpdateAdminDto {
  @IsEmail()
  @IsOptional()
  emailId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  phoneNo?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  password?: string;
}
