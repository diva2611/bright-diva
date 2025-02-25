import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../../common/enum/role.enum';

export class CreateAdminDto {
  @IsEmail()
  emailId: string;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  phoneNo: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  password: string;
}
