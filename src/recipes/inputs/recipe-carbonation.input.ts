import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { CarbonationProfile } from 'src/profiles/entities/carbonation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export class RecipeCarbonationInput {
  @PrimaryKeyUUID()
  id?: string;

  @IsEntity({ entity: CarbonationProfile })
  carbonationProfile!: CarbonationProfile;

  @IsString()
  @IsOptional()
  amountUsed?: string | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsOptional()
  temperature?: number | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  co2Volumes?: number | null;
}
