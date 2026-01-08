import { Migration } from '@mikro-orm/migrations';

export class Migration20260107213523_ChangeBeerStyleDecimalsToDouble extends Migration {
  override up(): void {
    this.addSql(
      `alter table "beer_style" alter column "min_abv" type double precision using ("min_abv"::double precision);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_abv" type double precision using ("max_abv"::double precision);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_og" type double precision using ("min_og"::double precision);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_og" type double precision using ("max_og"::double precision);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_fg" type double precision using ("min_fg"::double precision);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_fg" type double precision using ("max_fg"::double precision);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_ibu" type double precision using (case when "min_ibu"::text ~ '^[0-9]+[.]?[0-9]*$' then "min_ibu"::double precision else null end);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_ibu" type double precision using (case when "max_ibu"::text ~ '^[0-9]+[.]?[0-9]*$' then "max_ibu"::double precision else null end);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_color_ebc" type double precision using (case when "min_color_ebc"::text ~ '^[0-9]+[.]?[0-9]*$' then "min_color_ebc"::double precision else null end);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_color_ebc" type double precision using (case when "max_color_ebc"::text ~ '^[0-9]+[.]?[0-9]*$' then "max_color_ebc"::double precision else null end);`,
    );
  }

  override down(): void {
    this.addSql(
      `alter table "beer_style" alter column "min_abv" type numeric(4,1) using ("min_abv"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_abv" type numeric(4,1) using ("max_abv"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_og" type numeric(5,3) using ("min_og"::numeric(5,3));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_og" type numeric(5,3) using ("max_og"::numeric(5,3));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_fg" type numeric(5,3) using ("min_fg"::numeric(5,3));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_fg" type numeric(5,3) using ("max_fg"::numeric(5,3));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_ibu" type numeric(4,1) using ("min_ibu"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_ibu" type numeric(4,1) using ("max_ibu"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_color_ebc" type numeric(4,1) using ("min_color_ebc"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_color_ebc" type numeric(4,1) using ("max_color_ebc"::numeric(4,1));`,
    );
  }
}
