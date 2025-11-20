import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeType } from '../entities/recipe.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { User } from 'src/users/entities/user.entity';
import { BeerStyle } from 'src/catalog/entities/beer-style.entity';
import { Equipment } from 'src/catalog/entities/equipment.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export class RecipeInput {
  @IsOptional()
  @PrimaryKeyUUID()
  id?: string;

  @IsOptional()
  @IsEntity({ entity: User })
  user?: User;

  @IsEntity({ entity: BeerStyle })
  beerStyle!: BeerStyle;

  @IsOptional()
  @IsEntity({ entity: Equipment })
  equipment?: Equipment | null;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @IsString()
  @IsOptional()
  about?: string | null;

  @IsString()
  @IsOptional()
  notes?: string | null;

  @IsEnum(RecipeType)
  type!: RecipeType;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsOptional()
  plannedVolume?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsOptional()
  finalVolume?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsOptional()
  mashVolume?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsOptional()
  boilTime?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  originalGravity?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  finalGravity?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsOptional()
  estimatedIbu?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsOptional()
  estimatedColor?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  estimatedAbv?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsOptional()
  plannedEfficiency?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsOptional()
  actualEfficiency?: number | null;

  @IsDateString()
  @IsOptional()
  brewDate?: string | null;
}
