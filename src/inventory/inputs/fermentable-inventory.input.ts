import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { FermentableInventoryUnit } from '../entities/fermentable-inventory.entity';
import { TransformIfEntityExists } from 'src/database/common/decorators/transform-if-entity-exists.decorator';

export class FermentableInventoryInput {
  @IsOptional()
  @IsUUID()
  id?: string;

  @TransformIfEntityExists({ entity: User })
  user!: User;

  @TransformIfEntityExists({ entity: Fermentable })
  fermentable!: Fermentable;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Type(() => Number)
  quantity!: number;

  @IsEnum(FermentableInventoryUnit)
  unit!: FermentableInventoryUnit;

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
  @Max(100)
  @Type(() => Number)
  extractPotential?: number;

  @IsOptional()
  @IsString()
  lotNumber?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  moisture?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  protein?: number;
}
