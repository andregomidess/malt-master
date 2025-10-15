import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FermentationStepInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stepOrder!: number;

  @IsString()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(35)
  temperature!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1.0)
  @Max(1.1)
  targetGravity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(30)
  pressureControl?: number;

  @IsBoolean()
  isRamping!: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rampTime?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(35)
  rampToTemperature?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
