import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ChillerType,
  CoolingType,
  EquipmentMaterial,
  EquipmentType,
  HeatingSource,
} from '../entities/equipment.entity';
import { User } from 'src/users/entities/user.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';

export class EquipmentInput<TType extends EquipmentType> {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsEntity({ entity: User })
  user?: User;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EquipmentType)
  type!: TType;

  @IsEnum(EquipmentMaterial)
  material!: EquipmentMaterial;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  totalCapacity!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  usableVolume!: number;
}

export class KettleEquipmentInput extends EquipmentInput<EquipmentType.KETTLE> {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  kettleLoss!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  evaporationRate!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  boilOffRate!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  heatingPower!: number;

  @IsEnum(HeatingSource)
  heatingSource!: HeatingSource;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  thermalShrinkagePercent?: number;

  constructor() {
    super();
    this.type = EquipmentType.KETTLE;
  }
}

export class FermenterEquipmentInput extends EquipmentInput<EquipmentType.FERMENTER> {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  fermenterLoss!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  coneBottomVolume!: number;

  @Type(() => Boolean)
  @IsBoolean()
  hasTemperatureControl!: boolean;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  maxPressure!: number;

  @IsEnum(CoolingType)
  coolingType!: CoolingType;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  minTemperature!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  maxTemperature!: number;

  constructor() {
    super();
    this.type = EquipmentType.FERMENTER;
  }
}

export class ChillerEquipmentInput extends EquipmentInput<EquipmentType.CHILLER> {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  coolingCapacity!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  flowRate!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  inletTemperature!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  outletTemperature!: number;

  @IsEnum(ChillerType)
  chillerType!: ChillerType;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  tubeLength!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  tubeDiameter!: number;

  constructor() {
    super();
    this.type = EquipmentType.CHILLER;
  }
}

export type EquipmentInputUnion =
  | KettleEquipmentInput
  | FermenterEquipmentInput
  | ChillerEquipmentInput;
