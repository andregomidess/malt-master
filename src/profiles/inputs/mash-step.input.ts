import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MashStepType } from '../entities/mash-step.entity';

export class MashStepInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stepOrder!: number;

  @IsString()
  name!: string;

  @IsEnum(MashStepType)
  stepType!: MashStepType;

  @Type(() => Number)
  @IsNumber()
  @Min(35)
  @Max(80)
  temperature!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  infusionAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  infusionTemp?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  decoctionAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rampTime?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
