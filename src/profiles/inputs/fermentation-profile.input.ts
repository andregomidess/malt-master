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
import { FermentationProfileType } from '../entities/fermentation-profile.entity';
import { FermentationStepInput } from './fermentation-step.input';

export class FermentationProfileInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsEnum(FermentationProfileType)
  type!: FermentationProfileType;

  @IsOptional()
  @IsString()
  yeastStrain?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1.0)
  @Max(1.1)
  targetFinalGravity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(50)
  @Max(95)
  estimatedAttenuation?: number;

  @IsBoolean()
  isMultiStage!: boolean;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsBoolean()
  isPublic!: boolean;

  @ValidateNested({ each: true })
  @Type(() => FermentationStepInput)
  steps!: FermentationStepInput[];
}
