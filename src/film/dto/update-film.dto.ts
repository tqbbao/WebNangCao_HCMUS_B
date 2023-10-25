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

export class UpdateFilmDTO {
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1, 255, {
      message: 'Firstname must be between 1 and 255 characters.',
    })
    title: string;
  
    @Expose()
    @ApiProperty()
    @IsString()
    description?: string;
  
    @Expose()
    @ApiProperty()
    @IsNumber()
    release_year?: number;
  
    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    rental_duration?: number;
  
    @Expose()
    @ApiProperty()
    rental_rate?: number;
  
    @Expose()
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    length?: number;
  
    @Expose()
    @ApiProperty()
    replacement_cost?: number;
  
    @Expose()
    @ApiProperty({ enum: RatingRole })
    @IsString()
    @IsEnum(RatingRole)
    rating?: RatingRole;
  
    @Expose()
    @ApiProperty({ enum: SpecialFeaturesRole })
    @IsString()
    @IsEnum(SpecialFeaturesRole)
    special_features?: SpecialFeaturesRole;
  
    @Expose()
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    language_id: number;
  
    @Expose()
    @ApiProperty()
    original_language_id: number;
}
