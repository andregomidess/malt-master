import {
  Entity,
  Property,
  ManyToOne,
  OneToOne,
  Cascade,
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { MashProfile } from 'src/profiles/entities/mash-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class RecipeMash {
  @PrimaryKeyUUID()
  id!: string;

  @OneToOne(() => Recipe, { owner: true, cascade: [Cascade.REMOVE] })
  recipe!: Recipe;

  @ManyToOne(() => MashProfile)
  mashProfile!: MashProfile;

  @Property({ type: 'double', nullable: true })
  actualEfficiency!: number | null;
}
