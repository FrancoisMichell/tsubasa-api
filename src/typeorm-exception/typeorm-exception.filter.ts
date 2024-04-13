import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class TypeormExceptionFilter extends BaseExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.driverError.code) {
      case '23505': {
        const statusCode = HttpStatus.CONFLICT;
        response.status(statusCode).json({
          statusCode,
          message,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
