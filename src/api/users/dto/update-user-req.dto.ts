import {
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  emailId?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  phoneNo?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
