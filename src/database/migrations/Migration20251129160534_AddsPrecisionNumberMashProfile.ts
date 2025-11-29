import { Migration } from '@mikro-orm/migrations';

export class Migration20251129160534_AddsPrecisionNumberMashProfile extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "mash_profile" alter column "estimated_efficiency" type numeric(5,2) using ("estimated_efficiency"::numeric(5,2));`);
    this.addSql(`alter table "mash_profile" alter column "grain_temperature" type numeric(5,2) using ("grain_temperature"::numeric(5,2));`);
    this.addSql(`alter table "mash_profile" alter column "tun_temperature" type numeric(5,2) using ("tun_temperature"::numeric(5,2));`);
    this.addSql(`alter table "mash_profile" alter column "sparge_temperature" type numeric(5,2) using ("sparge_temperature"::numeric(5,2));`);
    this.addSql(`alter table "mash_profile" alter column "tun_weight" type numeric(8,2) using ("tun_weight"::numeric(8,2));`);
    this.addSql(`alter table "mash_profile" alter column "tun_specific_heat" type numeric(3,2) using ("tun_specific_heat"::numeric(3,2));`);
    this.addSql(`alter table "mash_profile" alter column "mash_thickness" type numeric(4,2) using ("mash_thickness"::numeric(4,2));`);

    this.addSql(`alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`);
    this.addSql(`alter table "tasting_note" alter column "tasting_date" set default 'now()';`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "batch_equipment" ("id" uuid not null default uuid_generate_v4(), "batch_id" uuid not null, "equipment_id" uuid not null, constraint "batch_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "batch_equipment" add constraint "batch_equipment_batch_id_equipment_id_unique" unique ("batch_id", "equipment_id");`);

    this.addSql(`create table "recipe_equipment" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "equipment_id" uuid not null, constraint "recipe_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "recipe_equipment" add constraint "recipe_equipment_recipe_id_equipment_id_unique" unique ("recipe_id", "equipment_id");`);

    this.addSql(`alter table "mash_profile" alter column "estimated_efficiency" type numeric(10,0) using ("estimated_efficiency"::numeric(10,0));`);
    this.addSql(`alter table "mash_profile" alter column "grain_temperature" type numeric(10,0) using ("grain_temperature"::numeric(10,0));`);
    this.addSql(`alter table "mash_profile" alter column "tun_temperature" type numeric(10,0) using ("tun_temperature"::numeric(10,0));`);
    this.addSql(`alter table "mash_profile" alter column "sparge_temperature" type numeric(10,0) using ("sparge_temperature"::numeric(10,0));`);
    this.addSql(`alter table "mash_profile" alter column "tun_weight" type numeric(10,0) using ("tun_weight"::numeric(10,0));`);
    this.addSql(`alter table "mash_profile" alter column "tun_specific_heat" type numeric(10,0) using ("tun_specific_heat"::numeric(10,0));`);
    this.addSql(`alter table "mash_profile" alter column "mash_thickness" type numeric(10,0) using ("mash_thickness"::numeric(10,0));`);

    this.addSql(`alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`);
    this.addSql(`alter table "tasting_note" alter column "tasting_date" set default '2025-11-29';`);
  }

}
