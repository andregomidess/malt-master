import { Migration } from '@mikro-orm/migrations';

export class Migration20260128031129_AddsColumnPpgInFermentable extends Migration {
  override up(): void {
    this.addSql(
      `alter table "fermentable" add column "ppg" numeric(10,0) null;`,
    );
  }

  override down(): void {
    this.addSql(`alter table "fermentable" drop column "ppg";`);
  }
}
