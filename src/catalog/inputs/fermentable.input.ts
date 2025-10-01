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
import { TransformIfEntityExists } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { User } from 'src/users/entities/user.entity';

export class FermentableInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @TransformIfEntityExists({ entity: User, optional: true })
  user?: User;

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
