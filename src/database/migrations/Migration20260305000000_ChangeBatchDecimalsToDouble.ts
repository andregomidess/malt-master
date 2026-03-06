import { Migration } from '@mikro-orm/migrations';

export class Migration20260305000000_ChangeBatchDecimalsToDouble extends Migration {
  override up(): void {
    this.addSql(
      `alter table "batch" alter column "planned_volume" type double precision using ("planned_volume"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "final_volume" type double precision using ("final_volume"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_original_gravity" type double precision using ("actual_original_gravity"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_final_gravity" type double precision using ("actual_final_gravity"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_ibu" type double precision using ("actual_ibu"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_color" type double precision using ("actual_color"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_abv" type double precision using ("actual_abv"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_efficiency" type double precision using ("actual_efficiency"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "fermentation_temperature" type double precision using ("fermentation_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_carbonation" type double precision using ("actual_carbonation"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "mash_ph" type double precision using ("mash_ph"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "pre_boil_gravity" type double precision using ("pre_boil_gravity"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "pre_boil_volume" type double precision using ("pre_boil_volume"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "post_boil_volume" type double precision using ("post_boil_volume"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "water_in_fermenter" type double precision using ("water_in_fermenter"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "fermenter_volume" type double precision using ("fermenter_volume"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "peak_fermentation_temp" type double precision using ("peak_fermentation_temp"::double precision);`,
    );
    this.addSql(
      `alter table "batch" alter column "bottling_volume" type double precision using ("bottling_volume"::double precision);`,
    );
  }

  override down(): void {
    this.addSql(
      `alter table "batch" alter column "planned_volume" type numeric(10,0) using ("planned_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "final_volume" type numeric(10,0) using ("final_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_original_gravity" type numeric(10,0) using ("actual_original_gravity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_final_gravity" type numeric(10,0) using ("actual_final_gravity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_ibu" type numeric(10,0) using ("actual_ibu"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_color" type numeric(10,0) using ("actual_color"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_abv" type numeric(10,0) using ("actual_abv"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_efficiency" type numeric(10,0) using ("actual_efficiency"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "fermentation_temperature" type numeric(10,0) using ("fermentation_temperature"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "actual_carbonation" type numeric(10,0) using ("actual_carbonation"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "mash_ph" type numeric(10,0) using ("mash_ph"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "pre_boil_gravity" type numeric(10,0) using ("pre_boil_gravity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "pre_boil_volume" type numeric(10,0) using ("pre_boil_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "post_boil_volume" type numeric(10,0) using ("post_boil_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "water_in_fermenter" type numeric(10,0) using ("water_in_fermenter"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "fermenter_volume" type numeric(10,0) using ("fermenter_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "peak_fermentation_temp" type numeric(10,0) using ("peak_fermentation_temp"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "batch" alter column "bottling_volume" type numeric(10,0) using ("bottling_volume"::numeric(10,0));`,
    );
  }
}
