import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { Language } from 'src/entity/language.entity';
import { RatingRole } from 'src/utils/enums/RatingRole.enum';
import { SpecialFeaturesRole } from 'src/utils/enums/SpecialFeaturesRole.enum';

export class CreateFilmDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  releaseYear: number;

  @ApiProperty()
  languageId: number;

  @ApiProperty()
  originalLanguageId: number;

  @ApiProperty()
  rentalDuration: number;

  @ApiProperty({enum: RatingRole})
  rentalRate: RatingRole;

  @ApiProperty()
  length: number;

  @ApiProperty()
  replacementCost: string;

  @ApiProperty()
  rating: string;

  @ApiProperty({enum: SpecialFeaturesRole})
  specialFeatures: SpecialFeaturesRole;

}
