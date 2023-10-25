import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(url: string, time: string, apiKey: string): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}