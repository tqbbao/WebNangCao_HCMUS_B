import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     const errorResponse = {
//       code: status,
//       timestamp: new Date().toLocaleDateString(),
//       path: request.url,
//       method: request.method,
//       message:
//         exception.message && exception.message.error
//           ? exception.message.error
//           : exception.message || null,
//     };

//     Logger.error(
//       `${request.method} ${request.url}`,
//       JSON.stringify(errorResponse),
//       'ExceptionFilter',
//     );

//     response.status(status).json({ errorResponse });
//   }
// }

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let errorResponse: {
      code: number;
      timestamp: string;
      path: string;
      method: string;
      message: string | null;
      errors?: any;
    } = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
    };

    if (status === HttpStatus.BAD_REQUEST) {
      // Xử lý lỗi kiểm tra dữ liệu từ class-validator
      const validationErrors = exception.getResponse() as ValidationError[];
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        const validationErrorMessages = this.extractValidationErrors(validationErrors);
        errorResponse.message = 'Validation failed';
        errorResponse.errors = validationErrorMessages;
      }
    }

    response.status(status).json({ errorResponse });
  }

  private extractValidationErrors(validationErrors: ValidationError[]) {
    const errors: any = {};
    validationErrors.forEach((error) => {
      Object.values(error.constraints).forEach((message) => {
        if (!errors[error.property]) {
          errors[error.property] = [];
        }
        errors[error.property].push(message);
      });
    });
    return errors;
  }
}