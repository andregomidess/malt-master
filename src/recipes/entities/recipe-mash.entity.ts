import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { MashProfile } from 'src/profiles/entities/mash-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

@Entity()
export class RecipeMash {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => MashProfile)
  mash_profile!: MashProfile;

  @Property({ type: 'decimal', nullable: true })
  actual_efficiency!: number | null;
}
