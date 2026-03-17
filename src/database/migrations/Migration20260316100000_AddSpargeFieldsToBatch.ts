import { Migration } from '@mikro-orm/migrations';

export class Migration20260316100000_AddSpargeFieldsToBatch extends Migration {
  override up(): void {
    this.addSql(
      `alter table "batch" add column "sparge_method" varchar(20) null;`,
    );
    this.addSql(
      `alter table "batch" add column "sparge_volume" double precision null;`,
    );
    this.addSql(
      `alter table "batch" add column "sparge_temperature" double precision null;`,
    );
  }

  override down(): void {
    this.addSql(`alter table "batch" drop column "sparge_method";`);
    this.addSql(`alter table "batch" drop column "sparge_volume";`);
    this.addSql(`alter table "batch" drop column "sparge_temperature";`);
  }
}
