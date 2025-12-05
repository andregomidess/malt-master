import { Migration } from '@mikro-orm/migrations';

export class Migration20251205005603_FixrecipeImageUrlUserType extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "carbonation_profile" drop constraint "carbonation_profile_user_id_foreign";`);

    this.addSql(`alter table "carbonation_profile" alter column "user_id" drop default;`);
    this.addSql(`alter table "carbonation_profile" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "carbonation_profile" alter column "user_id" drop not null;`);
    this.addSql(`alter table "carbonation_profile" add constraint "carbonation_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "recipe" alter column "image_url" type text using ("image_url"::text);`);

    this.addSql(`alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`);
    this.addSql(`alter table "tasting_note" alter column "tasting_date" set default 'now()';`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "batch_equipment" ("id" uuid not null default uuid_generate_v4(), "batch_id" uuid not null, "equipment_id" uuid not null, constraint "batch_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "batch_equipment" add constraint "batch_equipment_batch_id_equipment_id_unique" unique ("batch_id", "equipment_id");`);

    this.addSql(`create table "recipe_equipment" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "equipment_id" uuid not null, constraint "recipe_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "recipe_equipment" add constraint "recipe_equipment_recipe_id_equipment_id_unique" unique ("recipe_id", "equipment_id");`);

    this.addSql(`alter table "carbonation_profile" drop constraint "carbonation_profile_user_id_foreign";`);

    this.addSql(`alter table "carbonation_profile" alter column "user_id" drop default;`);
    this.addSql(`alter table "carbonation_profile" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "carbonation_profile" alter column "user_id" set not null;`);

    this.addSql(`alter table "recipe" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));`);

    this.addSql(`alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`);
    this.addSql(`alter table "tasting_note" alter column "tasting_date" set default '2025-11-29';`);
  }

}
