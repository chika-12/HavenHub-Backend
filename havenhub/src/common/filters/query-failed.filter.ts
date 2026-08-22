import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  //ConflictException,
  //BadRequestException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError & { code?: string; detail?: string },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case '23505': // unique_violation
        return response.status(409).json({
          statusCode: 409,
          message: 'A record with this value already exists.',
        });
      case '23503': // foreign_key_violation
        return response.status(400).json({
          statusCode: 400,
          message: 'Referenced record does not exist.',
          detail: exception.detail,
        });

      case '23502': // not_null_violation
        return response.status(400).json({
          statusCode: 400,
          message: 'A required field is missing.',
        });

      default:
        return response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
        });
    }
  }
}
