import {
  Entity,
  Property,
  ManyToOne,
  Enum,
  OptionalProps,
} from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyDeletedAt } from 'src/database/common/helpers/PropertyDeletedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

export enum EquipmentType {
  KETTLE = 'kettle',
  FERMENTER = 'fermenter',
  CHILLER = 'chiller',
}

export enum EquipmentMaterial {
  STAINLESS_STEEL = 'stainless_steel',
  ALUMINUM = 'aluminum',
  PLASTIC = 'plastic',
  GLASS = 'glass',
  COPPER = 'copper',
}

export enum HeatingSource {
  GAS = 'gas',
  ELECTRIC = 'electric',
  INDUCTION = 'induction',
  STEAM = 'steam',
  DIRECT_FIRE = 'direct_fire',
}

export enum CoolingType {
  AIR_CONDITIONING = 'air_conditioning',
  GLYCOL = 'glycol',
  IMMERSION_COIL = 'immersion_coil',
  PLATE_CHILLER = 'plate_chiller',
  NATURAL = 'natural',
}

export enum ChillerType {
  COUNTERFLOW = 'counterflow',
  PLATE = 'plate',
  IMMERSION = 'immersion',
  ICE_BATH = 'ice_bath',
}

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: {
    [EquipmentType.KETTLE]: 'KettleEquipment',
    [EquipmentType.FERMENTER]: 'FermenterEquipment',
    [EquipmentType.CHILLER]: 'ChillerEquipment',
  },
})
export abstract class Equipment {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @Property({ unique: true })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description!: string | null;

  @Property({ type: 'double', precision: 10, scale: 2 })
  totalCapacity!: number;

  @Property({ type: 'double', precision: 10, scale: 2 })
  usableVolume!: number;

  @Enum(() => EquipmentType)
  type!: EquipmentType;

  @Enum(() => EquipmentMaterial)
  material!: EquipmentMaterial;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date | null;

  @PropertyDeletedAt()
  deletedAt!: Date | null;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';

  public isKettle(): this is KettleEquipment {
    return this.type === EquipmentType.KETTLE;
  }

  public isFermenter(): this is FermenterEquipment {
    return this.type === EquipmentType.FERMENTER;
  }

  public isChiller(): this is ChillerEquipment {
    return this.type === EquipmentType.CHILLER;
  }

  public isEquipment(): this is Equipment {
    return this.isKettle() || this.isFermenter() || this.isChiller();
  }
}

@Entity()
export class KettleEquipment extends Equipment {
  @Property({ type: 'double', precision: 8, scale: 2 })
  kettleLoss!: number;

  @Property({ type: 'double', precision: 5, scale: 2 })
  evaporationRate!: number;

  @Property({ type: 'double', precision: 5, scale: 2 })
  boilOffRate!: number;

  @Property({ type: 'double', precision: 8, scale: 0 })
  heatingPower!: number;

  @Enum(() => HeatingSource)
  heatingSource!: HeatingSource;

  constructor() {
    super();
    this.type = EquipmentType.KETTLE;
  }
}

@Entity()
export class FermenterEquipment extends Equipment {
  @Property({ type: 'double', precision: 8, scale: 2 })
  fermenterLoss!: number;

  @Property({ type: 'double', precision: 8, scale: 2 })
  coneBottomVolume!: number;

  @Property({ type: 'boolean' })
  hasTemperatureControl!: boolean;

  @Property({ type: 'double', precision: 5, scale: 1 })
  maxPressure!: number;

  @Enum(() => CoolingType)
  coolingType!: CoolingType;

  @Property({ type: 'double', precision: 4, scale: 1 })
  minTemperature!: number;

  @Property({ type: 'double', precision: 4, scale: 1 })
  maxTemperature!: number;

  constructor() {
    super();
    this.type = EquipmentType.FERMENTER;
  }
}

// Com STI, todas as propriedades ficam na mesma tabela 'equipment'
@Entity()
export class ChillerEquipment extends Equipment {
  @Property({ type: 'double', precision: 8, scale: 0 })
  coolingCapacity!: number;

  @Property({ type: 'double', precision: 6, scale: 2 })
  flowRate!: number;

  @Property({ type: 'double', precision: 4, scale: 1 })
  inletTemperature!: number;

  @Property({ type: 'double', precision: 4, scale: 1 })
  outletTemperature!: number;

  @Enum(() => ChillerType)
  chillerType!: ChillerType;

  @Property({ type: 'double', precision: 6, scale: 2 })
  tubeLength!: number;

  @Property({ type: 'double', precision: 5, scale: 2 })
  tubeDiameter!: number;

  constructor() {
    super();
    this.type = EquipmentType.CHILLER;
  }
}
