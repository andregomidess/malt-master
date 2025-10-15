import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CarbonationType,
  PrimingSugarType,
} from '../entities/carbonation-profile.entity';

export class CarbonationProfileInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsEnum(CarbonationType)
  type!: CarbonationType;

  @Type(() => Number)
  @IsNumber()
  @Min(1.0)
  @Max(5.0)
  targetCO2Volumes!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(15)
  servingTemperature!: number;

  @IsOptional()
  @IsEnum(PrimingSugarType)
  primingSugarType?: PrimingSugarType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(3)
  @Max(10)
  primingSugarAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(5)
  @Max(30)
  kegPressure?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  carbonationTime?: number;

  @IsOptional()
  @IsString()
  carbonationMethod?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsBoolean()
  isPublic!: boolean;
}
