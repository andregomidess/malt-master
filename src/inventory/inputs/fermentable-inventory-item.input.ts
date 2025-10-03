import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { FermentableInventoryUnit } from '../entities/fermentable-inventory-item.entity';
import { InventoryItemType } from '../entities/base-inventory-item.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { BaseInventoryItemInput } from './base-inventory-item.input';

export class FermentableInventoryItemInput extends BaseInventoryItemInput<InventoryItemType.FERMENTABLE> {
  @IsEntity({ entity: Fermentable })
  fermentable!: Fermentable;

  @IsEnum(FermentableInventoryUnit)
  unit!: FermentableInventoryUnit;

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

  constructor() {
    super();
    this.type = InventoryItemType.FERMENTABLE;
  }
}
