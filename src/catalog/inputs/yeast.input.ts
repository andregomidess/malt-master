import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { YeastFormat, YeastType } from '../entities/yeast.entity';
import { Type } from 'class-transformer';
import { YeastFlocculation } from '../entities/yeast.entity';

export class YeastInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsEnum(YeastType)
  type!: YeastType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  attenuation?: number;

  @IsEnum(YeastFlocculation)
  flocculation!: YeastFlocculation;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  minTemp?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  maxTemp?: number;

  @IsEnum(YeastFormat)
  format!: YeastFormat;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  alcoholTolerance?: number;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  aromaFlavor?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
