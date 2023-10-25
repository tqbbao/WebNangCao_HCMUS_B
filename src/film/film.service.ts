import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from 'src/entity/film.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeleteResult, Repository } from 'typeorm';
import { CreateFilmDTO } from './dto/create-film.dto';
import { Language } from 'src/entity/language.entity';
import { plainToClass } from 'class-transformer';
import { UpdateFilmDTO } from './dto/update-film.dto';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async findAll(pagination: IPaginationOptions): Promise<Film[]> {
    const limit = Number(pagination.limit) || 10;
    const page = Number(pagination.page) || 1;
    const skip = (page - 1) * limit;
    return await this.filmRepository.find({
      skip: skip,
      take: limit,
      order: { filmId: 'ASC' },
      relations: {
        language: true,
        originalLanguage: true,
      },
    });
  }

  async findById(film_id: number): Promise<Film> {
    return await this.filmRepository.findOne({
      where: { filmId: film_id },
      relations: {
        language: true,
        originalLanguage: true,
      },
    });
  }

  async create(createFilm: CreateFilmDTO): Promise<Film> {
    const filmReal = plainToClass(CreateFilmDTO, createFilm, {
      excludeExtraneousValues: true,
    });
    console.log(filmReal);
    const language_id = await this.languageRepository.findOne({
      where: { languageId: createFilm.languageId },
    });
    const original_language_id = createFilm.originalLanguageId
      ? await this.languageRepository.findOne({
          where: { languageId: createFilm.originalLanguageId },
        })
      : null;

    try {
      const film = await this.filmRepository.create([{
        ...createFilm,
        languageId: language_id,
        originalLanguageId: original_language_id,
      }]);
      return await this.filmRepository.save(film[0]);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(film_id: number, updateFilm: UpdateFilmDTO): Promise<Film> {
    //   const testFilm = await this.findById(film_id);
    //   if (!testFilm) throw new NotFoundException(FILM_NOT_FOUND);

    //   const filmReal = plainToClass(CreateFilmDTO, updateFilm, {
    //     excludeExtraneousValues: true,
    //   });
    //   const language_id = await this.languageRepository.findOne({
    //     where: { languageId: filmReal.languageId },
    //   });
    //   const original_language_id = filmReal.originalLanguageId
    //     ? await this.languageRepository.findOne({
    //         where: { languageId: filmReal.originalLanguageId },
    //       })
    //     : null;

    //   const film = {...filmReal, language_id, original_language_id};

    //   await this.filmRepository.update(film_id, film);
    //   return await this.findById(film_id);
    // }
    // async delete(film_id: number): Promise<DeleteResult> {
    //   const testFilm = await this.findById(film_id);
    //   if (!testFilm) throw new NotFoundException(FILM_NOT_FOUND);
    //   return await this.filmRepository.delete(film_id);
    // }
    return;
  }
}
