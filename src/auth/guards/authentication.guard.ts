import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';
import { ApiKeyGuard } from './api-key.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.ApiKey;
  private readonly authTypeGuardMap: {
    [key in AuthType]: CanActivate | CanActivate[];
  } = {
    [AuthType.ApiKey]: this.apiKeyGuard,
    [AuthType.None]: { canActivate: () => true },
}

  constructor(
    private readonly reflector: Reflector,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {}


  async canActivate(context: ExecutionContext): Promise<boolean> {
    let authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      })

      if (canActivate) {
        return true;
      }
      throw error;
    }
  }
}