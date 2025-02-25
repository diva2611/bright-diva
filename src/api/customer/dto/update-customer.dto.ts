import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsString()
  @IsOptional()
  taxNumber?: string;

  @IsString()
  @IsOptional()
  businessRegistrationNumber?: string;
}
