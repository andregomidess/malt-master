import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { WaterProfile } from 'src/catalog/entities/water-profile.entity';

export class RecipeWaterInput {
  @IsEntity({ entity: WaterProfile })
  waterProfile!: WaterProfile;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @IsOptional()
  volume?: number | null;

  @IsString()
  @IsOptional()
  adjustments?: string | null;
}
