import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  FermentableForm,
  FermentableType,
} from '../entities/fermentable.entity';
import { Type } from 'class-transformer';

export class FermentableInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  name!: string;

  @IsEnum(FermentableType)
  type!: FermentableType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  color?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yield?: number;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsEnum(FermentableForm)
  form!: FermentableForm;

  @IsOptional()
  @IsString()
  notes?: string;
}
