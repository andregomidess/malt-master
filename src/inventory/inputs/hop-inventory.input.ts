import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
  IsString,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Hop } from 'src/catalog/entities/hop.entity';
import { HopInventoryUnit } from '../entities/hop-inventory.entity';
import { TransformIfEntityExists } from 'src/database/common/decorators/transform-if-entity-exists.decorator';

export class HopInventoryInput {
  @IsOptional()
  @IsUUID()
  id?: string;

  @TransformIfEntityExists({ entity: User })
  user!: User;

  @TransformIfEntityExists({ entity: Hop })
  hop!: Hop;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Type(() => Number)
  quantity!: number;

  @IsEnum(HopInventoryUnit)
  unit!: HopInventoryUnit;

  @IsOptional()
  @IsDateString()
  purchaseDate?: Date;

  @IsOptional()
  @IsDateString()
  bestBeforeDate?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  costPerUnit?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(30)
  @Type(() => Number)
  alphaAcidsAtPurchase?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @Type(() => Number)
  harvestYear?: number;

  @IsOptional()
  @IsString()
  storageCondition?: string;
}
