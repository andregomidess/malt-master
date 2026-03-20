import { Migration } from '@mikro-orm/migrations';

export class Migration20260319100000_RecipeDeleteCascade extends Migration {
  override up(): void {
    const tables = [
      'recipe_hop',
      'recipe_fermentable',
      'recipe_equipment',
      'recipe_water',
      'recipe_yeast',
    ] as const;

    for (const table of tables) {
      const constraintName = `${table}_recipe_id_foreign`;
      this.addSql(
        `alter table "${table}" drop constraint if exists "${constraintName}";`,
      );
      this.addSql(
        `alter table "${table}" add constraint "${constraintName}" foreign key ("recipe_id") references "recipe" ("id") on update cascade on delete cascade;`,
      );
    }
  }

  override down(): void {
    const tables = [
      'recipe_hop',
      'recipe_fermentable',
      'recipe_equipment',
      'recipe_water',
      'recipe_yeast',
    ] as const;

    for (const table of tables) {
      const constraintName = `${table}_recipe_id_foreign`;
      this.addSql(
        `alter table "${table}" drop constraint if exists "${constraintName}";`,
      );
      this.addSql(
        `alter table "${table}" add constraint "${constraintName}" foreign key ("recipe_id") references "recipe" ("id") on update cascade;`,
      );
    }
  }
}
