import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { FilmModule } from './film/film.module';
import { Film } from './entity/film.entity';
import { Language } from './entity/language.entity';
import { LoggerService } from './helpers/LoggerServiceWinston';
import { AuthModule } from './auth/auth.module';
import { User } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin123',
      database: 'temp_sakila',
      entities: [Film, Language, User],
      synchronize: false,
    }),
    ConfigModule.forRoot(),
    FilmModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],

})
export class AppModule {}
