import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { FermentationProfile } from 'src/profiles/entities/fermentation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export class RecipeFermentationInput {
  @PrimaryKeyUUID()
  id?: string;

  @IsEntity({ entity: FermentationProfile })
  fermentationProfile!: FermentationProfile;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsOptional()
  actualAttenuation?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  finalAbv?: number | null;

  @IsString()
  @IsOptional()
  observations?: string | null;
}
