import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
  Max,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import { YeastInventoryUnit } from '../entities/yeast-inventory-item.entity';
import { InventoryItemType } from '../entities/base-inventory-item.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { BaseInventoryItemInput } from './base-inventory-item.input';

export class YeastInventoryItemInput extends BaseInventoryItemInput<InventoryItemType.YEAST> {
  @IsEntity({ entity: Yeast })
  @IsUUID()
  yeast!: Yeast;

  @IsEnum(YeastInventoryUnit)
  unit!: YeastInventoryUnit;

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

  constructor() {
    super();
    this.type = InventoryItemType.YEAST;
  }
}
