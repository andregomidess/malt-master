import { Migration } from '@mikro-orm/migrations';

export class Migration20260128140000_RemovesPlannedEfficiencyFromRecipe extends Migration {
  override up(): void {
    this.addSql(`alter table "recipe" drop column "planned_efficiency";`);
  }

  override down(): void {
    this.addSql(
      `alter table "recipe" add column "planned_efficiency" double precision null;`,
    );
  }
}
