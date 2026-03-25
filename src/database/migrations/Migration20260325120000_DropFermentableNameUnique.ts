import { Migration } from '@mikro-orm/migrations';

export class Migration20260325120000_DropFermentableNameUnique extends Migration {
  override up(): void {
    this.addSql(
      `alter table "fermentable" drop constraint if exists "fermentable_name_unique";`,
    );
  }

  override down(): void {
    this.addSql(
      `alter table "fermentable" add constraint "fermentable_name_unique" unique ("name");`,
    );
  }
}
