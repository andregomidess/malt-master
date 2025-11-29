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
import { Type, Transform } from 'class-transformer';
import { MashProfileType } from '../entities/mash-profile.entity';
import { MashStepInput } from './mash-step.input';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { User } from 'src/users/entities/user.entity';

export class MashProfileInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsEntity({ entity: User })
  @IsUUID()
  @IsOptional()
  user?: User;

  @IsEnum(MashProfileType)
  type!: MashProfileType;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    return parseFloat(String(value));
  })
  @IsNumber()
  @Min(50)
  @Max(95)
  estimatedEfficiency?: number;

  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    return parseFloat(String(value));
  })
  @IsNumber()
  @Min(10)
  @Max(30)
  grainTemperature!: number;

  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    return parseFloat(String(value));
  })
  @IsNumber()
  @Min(10)
  @Max(30)
  tunTemperature!: number;

  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    return parseFloat(String(value));
  })
  @IsNumber()
  @Min(75)
  @Max(80)
  spargeTemperature!: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    return parseFloat(String(value));
  })
  @IsNumber()
  @Min(0)
  tunWeight?: number;

  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    return parseFloat(String(value));
  })
  @IsNumber()
  @Min(0.1)
  @Max(0.5)
  tunSpecificHeat!: number;

  @Transform(({ value }) => {
    if (typeof value === 'number') return value;
    return parseFloat(String(value));
  })
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
