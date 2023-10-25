import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { FilmService } from './film.service';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Film } from 'src/entity/film.entity';
import { CustomException } from 'src/utils/filters/custom-exception';
import { FILM_NOT_FOUND, USER_NO_CONTENT } from 'src/utils/errors/errors.constants';
import { UpdateFilmDTO } from './dto/update-film.dto';
import { CreateFilmDTO } from './dto/create-film.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@ApiTags('film')
@Auth(AuthType.ApiKey)
@Controller('film')
export class FilmController {
    constructor(private readonly filmService: FilmService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiOperation({ summary: 'Find all film' })
    @ApiResponse({ status: 200, description: 'Find all successfully.' })
    @ApiResponse({ status: 204, description: 'No Content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async findAll(@Query() pagination: IPaginationOptions): Promise<Film[]> {
        const films = await this.filmService.findAll(pagination);
        if(films.length === 0){
            throw new CustomException(USER_NO_CONTENT, HttpStatus.NO_CONTENT);
        }
        return films;
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Find film by id' })
    @ApiResponse({ status: 200, description: 'Find film by id successfully.' })
    @ApiResponse({ status: 204, description: 'No Content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async findById(@Param('id', ParseIntPipe) film_id: number): Promise<Film> {
        const film = await this.filmService.findById(film_id);
        if(!film){
            throw new NotFoundException(FILM_NOT_FOUND);
        }
        return film;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new film' })
    @ApiResponse({ status: 201, description: 'Create a new film successfully.' })
    @ApiResponse({ status: 204, description: 'No Content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async create(@Body() createFilm: CreateFilmDTO): Promise<Film> {
        return await this.filmService.create(createFilm);
    }   

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update film' })
    @ApiResponse({ status: 200, description: 'Update film successfully.' })
    @ApiResponse({ status: 204, description: 'No Content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async update(@Param('id', ParseIntPipe) film_id: number , @Body() updateFilm: UpdateFilmDTO): Promise<Film> {
        return await this.filmService.update(film_id, updateFilm);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete film' })
    @ApiResponse({ status: 200, description: 'Delete film successfully.' })
    @ApiResponse({ status: 204, description: 'No Content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async delete(@Param('id', ParseIntPipe) film_id: number){
        //return await this.filmService.delete(film_id);
    }

    
}
