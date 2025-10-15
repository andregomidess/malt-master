import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MashProfileType } from '../entities/mash-profile.entity';
import { MashStepInput } from './mash-step.input';

export class MashProfileInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsEnum(MashProfileType)
  type!: MashProfileType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(50)
  @Max(95)
  estimatedEfficiency?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(30)
  grainTemperature!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(30)
  tunTemperature!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(75)
  @Max(80)
  spargeTemperature!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tunWeight?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(0.5)
  tunSpecificHeat!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(2.0)
  @Max(5.0)
  mashThickness!: number;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsBoolean()
  isPublic!: boolean;

  @ValidateNested({ each: true })
  @Type(() => MashStepInput)
  steps!: MashStepInput[];
}
