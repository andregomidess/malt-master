import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { FermentableUsageType } from '../entities/recipe-fermentable.entity';

export class RecipeFermentableInput {
  @IsOptional()
  @PrimaryKeyUUID()
  id?: string;

  @IsEntity({ entity: Fermentable })
  fermentable!: Fermentable;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsOptional()
  amount?: number | null;

  @IsOptional()
  @IsEnum(FermentableUsageType)
  usageType?: FermentableUsageType | null;
}
