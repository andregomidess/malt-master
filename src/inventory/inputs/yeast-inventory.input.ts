import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
  IsString,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import { YeastInventoryUnit } from '../entities/yeast-inventory.entity';
import { TransformIfEntityExists } from 'src/database/common/decorators/transform-if-entity-exists.decorator';

export class YeastInventoryInput {
  @IsOptional()
  @IsUUID()
  id?: string;

  @TransformIfEntityExists({ entity: User })
  user!: User;

  @TransformIfEntityExists({ entity: Yeast })
  yeast!: Yeast;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Type(() => Number)
  quantity!: number;

  @IsEnum(YeastInventoryUnit)
  unit!: YeastInventoryUnit;

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
  @IsDateString()
  productionDate?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  viability?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cellCount?: number;

  @IsOptional()
  @IsBoolean()
  starter?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  pitchingRate?: number;
}
