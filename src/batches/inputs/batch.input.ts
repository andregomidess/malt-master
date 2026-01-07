import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUUID,
  IsDate,
} from 'class-validator';
import { BatchStatus } from '../entities/batch.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import { Equipment } from 'src/catalog/entities/equipment.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export class BatchInput {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsEntity({ entity: User })
  @IsUUID()
  user!: User;

  @IsEntity({ entity: Recipe })
  @IsUUID()
  recipe!: Recipe;

  @IsOptional()
  @IsEntity({ entity: Equipment })
  @IsUUID()
  equipment?: Equipment | null;

  @IsOptional()
  @IsString()
  batchCode?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  brewDate?: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  packagingDate?: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readyDate?: Date | null;

  @IsEnum(BatchStatus)
  status!: BatchStatus;

  @IsOptional()
  @IsNumber()
  plannedVolume?: number | null;

  @IsOptional()
  @IsNumber()
  finalVolume?: number | null;

  @IsOptional()
  @IsNumber()
  actualOriginalGravity?: number | null;

  @IsOptional()
  @IsNumber()
  actualFinalGravity?: number | null;

  @IsOptional()
  @IsNumber()
  actualIbu?: number | null;

  @IsOptional()
  @IsNumber()
  actualColor?: number | null;

  @IsOptional()
  @IsNumber()
  actualAbv?: number | null;

  @IsOptional()
  @IsNumber()
  actualEfficiency?: number | null;

  @IsOptional()
  @IsNumber()
  fermentationTemperature?: number | null;

  @IsOptional()
  @IsNumber()
  fermentationTime?: number | null;

  @IsOptional()
  @IsNumber()
  actualCarbonation?: number | null;

  // Valores medidos durante a sessão
  @IsOptional()
  @IsNumber()
  mashPh?: number | null;

  @IsOptional()
  @IsNumber()
  preBoilGravity?: number | null;

  @IsOptional()
  @IsNumber()
  preBoilVolume?: number | null;

  @IsOptional()
  @IsNumber()
  postBoilVolume?: number | null;

  @IsOptional()
  @IsNumber()
  waterInFermenter?: number | null;

  @IsOptional()
  @IsNumber()
  fermenterVolume?: number | null;

  @IsOptional()
  @IsNumber()
  peakFermentationTemp?: number | null;

  @IsOptional()
  @IsNumber()
  bottlingVolume?: number | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}
