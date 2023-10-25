import { Injectable } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private errorLogger;
  private combinedLogger;

  constructor() {
    this.errorLogger = createLogger({
      transports: [
        // Log errors into daily rotated files
        new DailyRotateFile({
          filename: `logs_v1/%DATE%-error.log`,
          level: 'error', // Chỉ ghi log ở level 'error'
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf((info) => {
              return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`;
            }),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        // Log to console for info error
        new transports.Console({
            format: format.combine(
              format.cli(),
              format.splat(),
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              format.printf((info) => {
                return `[${info.timestamp}] [${info.level}]: ${info.message}`;
              }),
            ),
          }),
      ],
    });

    this.combinedLogger = createLogger({
      transports: [
        // Log info levels into daily rotated files with level 'info'
        new DailyRotateFile({
          filename: `logs_v1/%DATE%-combined.log`,
          level: 'info', // Chỉ ghi log ở level 'info'
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Thêm thông tin thời gian
            format.printf((info) => {
              return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`;
            }),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),

        // Log to console for info level
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf((info) => {
              return `[${info.timestamp}] [${info.level}]: ${info.message}`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: string) {
    this.combinedLogger.log('info', message);
  }

  error(message: string, trace: string) {
    this.errorLogger.log('error', `${message}\n${trace}`);
  }
}