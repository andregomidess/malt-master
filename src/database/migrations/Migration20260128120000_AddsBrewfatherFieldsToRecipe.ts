import { Migration } from '@mikro-orm/migrations';

export class Migration20260128120000_AddsBrewfatherFieldsToRecipe extends Migration {
  override up(): void {
    this.addSql(
      `alter table "recipe" add column "mash_efficiency" double precision null;`,
    );
    this.addSql(
      `alter table "recipe" add column "brewhouse_efficiency" double precision null;`,
    );
    this.addSql(
      `alter table "recipe" add column "pre_boil_volume" double precision null;`,
    );
    this.addSql(
      `alter table "recipe" add column "post_boil_volume" double precision null;`,
    );
  }

  override down(): void {
    this.addSql(`alter table "recipe" drop column "mash_efficiency";`);
    this.addSql(`alter table "recipe" drop column "brewhouse_efficiency";`);
    this.addSql(`alter table "recipe" drop column "pre_boil_volume";`);
    this.addSql(`alter table "recipe" drop column "post_boil_volume";`);
  }
}
