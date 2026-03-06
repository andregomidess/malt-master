import { Migration } from '@mikro-orm/migrations';

export class Migration20260305100000_AddActualStrikeTempToBatch extends Migration {
  override up(): void {
    this.addSql(
      `alter table "batch" add column "actual_strike_temp" double precision null;`,
    );
  }

  override down(): void {
    this.addSql(`alter table "batch" drop column "actual_strike_temp";`);
  }
}
