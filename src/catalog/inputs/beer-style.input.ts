import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BeerTag, GlasswareType } from '../entities/beer-style.entity';
import { User } from 'src/users/entities/user.entity';
import { TransformIfEntityExists } from 'src/database/common/decorators/transform-if-entity-exists.decorator';

export class BeerStyleInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @TransformIfEntityExists({ entity: User, optional: true })
  user?: User;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  subCategory?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAbv?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAbv?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minOg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxOg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minFg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxFg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minIbu?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxIbu?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minColorEbc?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxColorEbc?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  aroma?: string;

  @IsOptional()
  @IsString()
  appearance?: string;

  @IsOptional()
  @IsString()
  flavor?: string;

  @IsOptional()
  @IsString()
  mouthfeel?: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  history?: string;

  @IsOptional()
  @IsString()
  ingredients?: string;

  @IsOptional()
  @IsString()
  examples?: string;

  @IsEnum(BeerTag, { each: true })
  tags!: BeerTag[];

  @IsOptional()
  @IsEnum(GlasswareType)
  glassware?: GlasswareType;

  @IsOptional()
  @IsString()
  origin?: string;
}
