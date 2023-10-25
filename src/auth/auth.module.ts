import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { HashingService } from './hashing/hashing.service';
import { CryptoService } from './hashing/crypto.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: CryptoService
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    ApiKeyGuard,
    AuthService
  ],
  controllers: [AuthController],

})
export class AuthModule { }
