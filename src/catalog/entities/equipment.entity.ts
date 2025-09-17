import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';
import { User } from 'src/users/entities/user.entity';

export enum EquipmentType {
  KETTLE = 'kettle',
  FERMENTER = 'fermenter',
  CHILLER = 'chiller',
  OTHER = 'other',
}

@Entity()
export class Equipment {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })
  description!: string | null;

  @Property({ type: 'decimal', nullable: true })
  totalCapacity!: number | null;

  @Property({ type: 'decimal', nullable: true })
  usableVolume!: number | null;

  @Property({ type: 'decimal', nullable: true })
  kettleLoss!: number | null;

  @Property({ type: 'decimal', nullable: true })
  fermenterLoss!: number | null;

  @Property({ type: 'decimal', nullable: true })
  evaporationRate!: number | null;

  @Property({ type: 'decimal', nullable: true })
  equipmentEfficiency!: number | null;

  @Property({ nullable: true })
  material!: string | null;

  @Enum(() => EquipmentType)
  type!: EquipmentType;
}
