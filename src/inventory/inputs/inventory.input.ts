import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
} from 'class-validator';
import { InventoryUnit } from '../entities/inventory.entity';
import { Type } from 'class-transformer';
import { EntityExists } from 'src/database/common/decorators/entity-exists.decorator';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { Hop } from 'src/catalog/entities/hop.entity';
import { Yeast } from 'src/catalog/entities/yeast.entity';

export class InventoryInput {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @EntityExists(Hop)
  @IsUUID()
  @IsOptional()
  hopId?: string;

  @EntityExists(Fermentable)
  @IsUUID()
  @IsOptional()
  fermentableId?: string;

  @EntityExists(Yeast)
  @IsUUID()
  @IsOptional()
  yeastId?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  quantity!: number;

  @IsEnum(InventoryUnit)
  @IsNotEmpty()
  unit!: InventoryUnit;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  purchaseDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  bestBeforeDate?: Date;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cost?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
