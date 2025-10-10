import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import { YeastStage } from '../entities/recipe-yeast.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export class RecipeYeastInput {
  @PrimaryKeyUUID()
  id?: string;

  @IsEntity({ entity: Yeast })
  yeast!: Yeast;

  @IsOptional()
  @IsString()
  amount?: string | null;

  @IsOptional()
  @IsString()
  pitchingRate?: string | null;

  @IsEnum(YeastStage)
  stage!: YeastStage;
}
