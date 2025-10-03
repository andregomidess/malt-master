import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsDateString,
  IsString,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Inventory } from '../entities/inventory.entity';
import { InventoryItemType } from '../entities/base-inventory-item.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { FermentableInventoryItemInput } from './fermentable-inventory-item.input';
import { HopInventoryItemInput } from './hop-inventory-item.input';
import { YeastInventoryItemInput } from './yeast-inventory-item.input';

export abstract class BaseInventoryItemInput<TType extends InventoryItemType> {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsEntity({ entity: Inventory })
  inventory!: Inventory;

  @IsEnum(InventoryItemType)
  type!: TType;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Type(() => Number)
  quantity!: number;

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
}

export type BaseInventoryItemInputUnion =
  | FermentableInventoryItemInput
  | HopInventoryItemInput
  | YeastInventoryItemInput;
