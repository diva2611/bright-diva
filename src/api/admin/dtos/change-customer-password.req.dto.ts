import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangeCustomerPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
