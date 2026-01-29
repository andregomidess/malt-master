import { Migration } from '@mikro-orm/migrations';

export class Migration20260128130000_AddsThermalShrinkageToEquipment extends Migration {
  override up(): void {
    this.addSql(
      `alter table "equipment" add column "thermal_shrinkage_percent" numeric(4,2) null default 4;`,
    );
  }

  override down(): void {
    this.addSql(
      `alter table "equipment" drop column "thermal_shrinkage_percent";`,
    );
  }
}
