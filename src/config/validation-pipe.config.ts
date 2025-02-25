import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { REMOVE_EXTRA_COMMA_AT_END_REGEX } from '../common/constants/constants';

const getTextualValidationError = (error: ValidationError): string => {
  let errorMessage = '';

  if (error.constraints) {
    Object.values(error.constraints || {}).forEach((constraint) => {
      errorMessage += `${constraint}, `;
    });
  }

  if (error.children && error.children.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const child of error.children) {
      errorMessage += getTextualValidationError(child);
    }
  }
  return errorMessage;
};

export const validationPipeOptions = (): ValidationPipeOptions => ({
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  exceptionFactory: (errors: ValidationError[]): HttpException => {
    let errorMessage = '';
    errors
      .map((issue) => getTextualValidationError(issue))
      .forEach((issueStr) => {
        errorMessage += issueStr;
        return errorMessage;
      });
    return new HttpException(
      errorMessage.replace(REMOVE_EXTRA_COMMA_AT_END_REGEX, ''),
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  },
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  validateCustomDecorators: true,
});
