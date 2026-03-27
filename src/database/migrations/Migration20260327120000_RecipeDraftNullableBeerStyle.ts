import { Migration } from '@mikro-orm/migrations';

export class Migration20260327120000_RecipeDraftNullableBeerStyle extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "recipe" alter column "beer_style_id" drop not null;`,
    );
    this.addSql(
      `alter table "recipe" add column "is_draft" boolean not null default false;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "recipe" drop column "is_draft";`);
    this.addSql(
      `update "recipe" set "beer_style_id" = (select "id" from "beer_style" limit 1) where "beer_style_id" is null;`,
    );
    this.addSql(
      `alter table "recipe" alter column "beer_style_id" set not null;`,
    );
  }
}
