import { Migration } from '@mikro-orm/migrations';

export class Migration20251129161141_FixPictureUrlUserType extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" alter column "picture_url" type text using ("picture_url"::text);`);

    this.addSql(`alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`);
    this.addSql(`alter table "tasting_note" alter column "tasting_date" set default 'now()';`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "batch_equipment" ("id" uuid not null default uuid_generate_v4(), "batch_id" uuid not null, "equipment_id" uuid not null, constraint "batch_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "batch_equipment" add constraint "batch_equipment_batch_id_equipment_id_unique" unique ("batch_id", "equipment_id");`);

    this.addSql(`create table "recipe_equipment" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "equipment_id" uuid not null, constraint "recipe_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "recipe_equipment" add constraint "recipe_equipment_recipe_id_equipment_id_unique" unique ("recipe_id", "equipment_id");`);

    this.addSql(`alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`);
    this.addSql(`alter table "tasting_note" alter column "tasting_date" set default '2025-11-29';`);

    this.addSql(`alter table "user" alter column "picture_url" type varchar(255) using ("picture_url"::varchar(255));`);
  }

}
