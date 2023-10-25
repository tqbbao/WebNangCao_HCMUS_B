import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { createHash } from 'crypto';

@Injectable()
export class CryptoService implements HashingService {


  async hash(url: string, time: string, secretKey: string): Promise<string> {
    return createHash('sha256').update(`${url}${time}${secretKey}`).digest('hex');
  }

  async compare(token: string, encrypted: string): Promise<boolean> {
    return token === encrypted;
  }
}