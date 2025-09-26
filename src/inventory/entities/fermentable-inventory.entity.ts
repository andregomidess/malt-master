import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';

export enum FermentableInventoryUnit {
  G = 'g',
  KG = 'kg',
  LB = 'lb', // Libras para maltes
  SACK = 'sack', // Sacos
}

@Entity()
export class FermentableInventory {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Fermentable)
  fermentable!: Fermentable;

  @Property({ type: 'decimal' })
  quantity!: number;

  @Property()
  unit!: FermentableInventoryUnit;

  @Property({ type: 'date', nullable: true })
  purchaseDate!: Date | null;

  @Property({ type: 'date', nullable: true })
  bestBeforeDate!: Date | null;

  @Property({ type: 'decimal', nullable: true })
  costPerUnit!: number | null;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  // Propriedades específicas de fermentáveis
  @Property({ type: 'decimal', nullable: true })
  extractPotential!: number | null; // Potencial de extração

  @Property({ nullable: true })
  lotNumber!: string | null;

  @Property({ type: 'decimal', nullable: true })
  moisture!: number | null; // % de umidade

  @Property({ type: 'decimal', nullable: true })
  protein!: number | null; // % de proteína

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;
}
