import { Migration } from '@mikro-orm/migrations';

export class Migration20251031002501_AddsTokenResetPassword extends Migration {
  override up(): void {
    this.addSql(
      `alter table "user" add column "password_reset_token" varchar(255) null, add column "password_reset_expiry" varchar(255) null;`,
    );

    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" set default 'now()';`,
    );
  }

  override down(): void {
    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" set default '2025-10-21';`,
    );

    this.addSql(
      `alter table "user" drop column "password_reset_token", drop column "password_reset_expiry";`,
    );
  }
}
