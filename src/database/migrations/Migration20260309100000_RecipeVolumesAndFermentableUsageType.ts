import { Migration } from '@mikro-orm/migrations';

export class Migration20260309100000_RecipeVolumesAndFermentableUsageType extends Migration {
  override up(): void {
    this.addSql(
      `alter table "recipe" add column "target_volume" double precision null;`,
    );
    this.addSql(
      `alter table "recipe" add column "volume_into_fermenter" double precision null;`,
    );
    this.addSql(
      `alter table "recipe" add column "packaged_volume" double precision null;`,
    );
    this.addSql(
      `alter table "recipe_fermentable" add column "usage_type" varchar(255) null;`,
    );
  }

  override down(): void {
    this.addSql(`alter table "recipe" drop column "target_volume";`);
    this.addSql(`alter table "recipe" drop column "volume_into_fermenter";`);
    this.addSql(`alter table "recipe" drop column "packaged_volume";`);
    this.addSql(`alter table "recipe_fermentable" drop column "usage_type";`);
  }
}
