import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { format, subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerServiceRotation {
  private logPath: string;
  private maxFileSize: number;
  private logRetentionDays: number; // Số ngày giữ lại tệp log
  private logLevels = {
    fatal: 'fatal',
    error: 'error',
    warn: 'warn',
    info: 'info',
    debug: 'debug',
    trace: 'trace',
  };

  constructor(
    logPath: string = './logs',
    maxFileSize: number = 1024 * 1,
    logRetentionDays: number = 30,
  ) {
    this.logPath = logPath;
    this.maxFileSize = maxFileSize;
    this.logRetentionDays = logRetentionDays;

    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath);
    }
  }

  log(message: string) {
    this.writeLog(this.logLevels.info, message);
  }

  error(message: string, trace: string) {
    this.writeLog(this.logLevels.error, `${message}\n${trace}`);
  }

  private writeLog(level: string, message: string) {
    const currentDate = new Date();
    const dateTime = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
    const logFileName = `${dateTime.split(' ')[0]}.log`;
    const logFilePath = path.join(this.logPath, logFileName);

    // Kiểm tra và xoay tệp log trước khi gh i log
    this.rotateLogFile(logFilePath);

    const logEntry = `[${uuidv4()}] [${dateTime}] [${level.toUpperCase()}] ${message}\n`;
    console.log(logEntry);

    // Xử lý lỗi khi ghi log
    try {
      fs.appendFileSync(logFilePath, logEntry);
    } catch (error) {
      console.error(`Error writing log: ${error}`);
    }
  }

  private rotateLogFile(logFilePath: string) {
    if (fs.existsSync(logFilePath)) {
      const stats = fs.statSync(logFilePath);
      if (stats.size > this.maxFileSize) {
        // Tạo tên tệp log xoay (rotated)
        const currentDate = new Date();
        const dateTime = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
        const rotatedLogFileName = `${dateTime.split(' ')[0]}-old.log`;
        const rotatedLogFilePath = path.join(this.logPath, rotatedLogFileName);
  
        try {
          // Đổi tên tệp log cũ thành tên tệp log xoay (rotated)
          fs.renameSync(logFilePath, rotatedLogFilePath);
          // Tạo tệp log mới để ghi log
          fs.writeFileSync(logFilePath, '');
          this.cleanOldLogFiles(); // Xóa tệp log cũ
        } catch (error) {
          console.error(`Error rotating log file: ${error}`);
        }
      }
    }
  }

  private cleanOldLogFiles() {
    const currentDate = new Date();
    const retentionDate = subDays(currentDate, this.logRetentionDays);
    const logFiles = fs.readdirSync(this.logPath);

    logFiles.forEach((file) => {
      const filePath = path.join(this.logPath, file);
      const fileStats = fs.statSync(filePath);
      if (fileStats.isFile() && fileStats.mtime < retentionDate) {
        fs.unlinkSync(filePath);
      }
    });
  }
}
