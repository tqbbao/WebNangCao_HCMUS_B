import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly hashingService: HashingService) { }


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractKeyFromHeader(request)
    const time = this.extractTimeFromHeader(request)

    if (!apiKey || !time) {
      throw new UnauthorizedException();
    }

    try {
      if (new Date().getTime() - new Date(time).getTime() > 60_000) {
        throw new UnauthorizedException();
      }

      const encrypted = await this.hashingService.hash(
        request.url,
        time,
        process.env.SECRET_KEY,
      )

      const isValid = await this.hashingService.compare(
        encrypted,
        apiKey
      )
      if (!isValid) {
        throw new UnauthorizedException();
      }

      return true;

    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    return type === 'ApiKey' ? key : undefined;
  }

  private extractTimeFromHeader(request: Request): string | undefined {
    const time = request.headers['x-time'];
    return Array.isArray(time) ? time[0] : time;
  }
}