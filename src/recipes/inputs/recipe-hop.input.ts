import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { Hop } from 'src/catalog/entities/hop.entity';
import { HopStage } from '../entities/recipe-hop.entity';

export class RecipeHopInput {
  @IsEntity({ entity: Hop })
  hop!: Hop;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsOptional()
  amount?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsOptional()
  boilTime?: number | null;

  @IsEnum(HopStage)
  stage!: HopStage;
}
