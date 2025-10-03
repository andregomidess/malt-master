import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HopForm } from '../entities/hop.entity';
import { HopUse } from '../entities/hop.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { User } from 'src/users/entities/user.entity';

export class HopInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsEntity({ entity: User })
  @IsOptional()
  user?: User;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  alphaAcids!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  betaAcids!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  cohumulone?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  totalOils?: number;

  @IsOptional()
  @IsEnum(HopForm)
  form?: HopForm;

  @IsOptional()
  @IsEnum(HopUse)
  uses?: HopUse[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  aromaFlavor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  harvestYear?: number;

  @IsOptional()
  @IsString()
  storageCondition?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  hsi?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  costPerKilogram?: number;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  supplier?: string;
}
