import { IsString, IsOptional, IsInt, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  customerName!: string;

  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsString()
  mobileNumber!: string;

  @IsEmail()
  emailId!: string;

  @IsString()
  businessRegistrationNumber!: string;

  @IsString()
  city!: string;

  @IsString()
  country!: string;

  @IsString()
  companyName!: string;
}
