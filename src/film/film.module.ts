import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { Film } from 'src/entity/film.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'src/entity/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Language])],
  controllers: [FilmController],
  providers: [FilmService]
})
export class FilmModule {}
