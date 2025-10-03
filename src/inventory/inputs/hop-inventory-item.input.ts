import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Hop } from 'src/catalog/entities/hop.entity';
import { HopInventoryUnit } from '../entities/hop-inventory-item.entity';
import { InventoryItemType } from '../entities/base-inventory-item.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { BaseInventoryItemInput } from './base-inventory-item.input';

export class HopInventoryItemInput extends BaseInventoryItemInput<InventoryItemType.HOP> {
  @IsEntity({ entity: Hop })
  hop!: Hop;

  @IsEnum(HopInventoryUnit)
  unit!: HopInventoryUnit;

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

  constructor() {
    super();
    this.type = InventoryItemType.HOP;
  }
}
