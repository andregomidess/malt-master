import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { MashProfile } from 'src/profiles/entities/mash-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export class RecipeMashInput {
  @IsOptional()
  @PrimaryKeyUUID()
  id?: string;

  @IsEntity({ entity: MashProfile })
  mashProfile!: MashProfile;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsOptional()
  actualEfficiency?: number | null;
}
