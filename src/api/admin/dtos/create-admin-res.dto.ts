import { IsBoolean, IsString } from 'class-validator';

export class CreateAdminResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  id: string;
}
