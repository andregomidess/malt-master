import { Migration } from '@mikro-orm/migrations';

export class Migration20260106224724_AddsMeasuredValuesToBatch extends Migration {
  override up(): void {
    this.addSql(
      `alter table "batch" add column "mash_ph" numeric(10,0) null, add column "pre_boil_gravity" numeric(10,0) null, add column "pre_boil_volume" numeric(10,0) null, add column "post_boil_volume" numeric(10,0) null, add column "water_in_fermenter" numeric(10,0) null, add column "fermenter_volume" numeric(10,0) null, add column "peak_fermentation_temp" numeric(10,0) null, add column "bottling_volume" numeric(10,0) null;`,
    );
  }

  override down(): void {
    this.addSql(
      `alter table "batch" drop column "mash_ph", drop column "pre_boil_gravity", drop column "pre_boil_volume", drop column "post_boil_volume", drop column "water_in_fermenter", drop column "fermenter_volume", drop column "peak_fermentation_temp", drop column "bottling_volume";`,
    );
  }
}
