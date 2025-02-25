import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ENVIRONMENT } from '../common/constants/constants';

enum Dialect {
  POSTGRES = 'mysql',
}

class EnvironmentVariables {
  @IsEnum(ENVIRONMENT)
  NODE_ENV: ENVIRONMENT;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_NAME: string;

  @IsEnum(Dialect)
  DATABASE_DIALECT: Dialect;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_USERNAME: string;

  @IsNumber()
  APP_PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new HttpException(
      errors.toString(),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return validatedConfig;
}
