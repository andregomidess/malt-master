import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class WaterProfileInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ca?: number;

  @IsOptional()
  @IsNumber()
  mg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  na?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  so4?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cl?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hco3?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ph?: number;

  @IsOptional()
  @IsString()
  recommendedStyle?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
