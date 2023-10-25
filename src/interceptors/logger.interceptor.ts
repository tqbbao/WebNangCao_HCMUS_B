import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerServiceRotation } from 'src/helpers/LoggerServiceRotation';
import { LoggerService } from 'src/helpers/LoggerServiceWinston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly loggerService: LoggerServiceRotation,
    private readonly loggerWinston: LoggerService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //console.log('Before...');
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    // ** NHẬN BODY REQUEST **
    const requestBody = request.body;
    // Đảm bảo requestBody là một object (nếu không, chuyển đổi nó)
    const bodyAsObject =
      typeof requestBody === 'object' ? requestBody : { body: requestBody };

    return next.handle().pipe(
      tap((response_data) => {
        //console.log(`After...Tap ${Date.now() - now}ms`);
        // ** GHI LOG **
        //this.loggerService.log(`${JSON.stringify(bodyAsObject)} -- [${response_data.statusCode}] ||[${request.method}] -- ${request.url} -- ${response_data.message}`);
        // ** GHI LOG WINSTON **
        this.loggerWinston.log(`${JSON.stringify(bodyAsObject)} -- [${response_data.statusCode}] ||[${request.method}] -- ${request.url} -- ${response_data.message}`);
      }),
      catchError((err) => {
        //console.log(`After...CatchError ${Date.now() - now}ms`);

        //** GHI LOG **
        //this.loggerService.error(`${JSON.stringify(bodyAsObject)} -- [${err.response.statusCode}] || [${request.method}] -- ${request.url} -- ${err.response.message}`, 'err.stack');

        // ** GHI LOG WINSTON **
        this.loggerWinston.error(`${JSON.stringify(bodyAsObject)} -- [${err.response.statusCode}] || [${request.method}] -- ${request.url} -- ${err.response.message}`, 'err.stack');
        throw err;
      }),
    );
  }
}
