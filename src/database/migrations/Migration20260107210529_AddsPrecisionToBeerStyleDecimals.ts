import { Migration } from '@mikro-orm/migrations';

export class Migration20260107210529_AddsPrecisionToBeerStyleDecimals extends Migration {
  override up(): void {
    // ABV: 0.0 a 20.0% - precisa de 1 casa decimal
    this.addSql(
      `alter table "beer_style" alter column "min_abv" type numeric(4,1) using ("min_abv"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_abv" type numeric(4,1) using ("max_abv"::numeric(4,1));`,
    );

    // OG e FG: 1.000 a 1.200 - precisa de 3 casas decimais
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

    // IBU: 0 a 120 - pode ser inteiro ou com 1 casa decimal
    // Converter de varchar para numeric
    this.addSql(
      `alter table "beer_style" alter column "min_ibu" type numeric(4,1) using (case when "min_ibu"::text ~ '^[0-9]+[.]?[0-9]*$' then "min_ibu"::numeric(4,1) else null end);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_ibu" type numeric(4,1) using (case when "max_ibu"::text ~ '^[0-9]+[.]?[0-9]*$' then "max_ibu"::numeric(4,1) else null end);`,
    );

    // Color EBC: 0 a 100 - pode ser inteiro ou com 1 casa decimal
    // Converter de varchar para numeric
    this.addSql(
      `alter table "beer_style" alter column "min_color_ebc" type numeric(4,1) using (case when "min_color_ebc"::text ~ '^[0-9]+[.]?[0-9]*$' then "min_color_ebc"::numeric(4,1) else null end);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_color_ebc" type numeric(4,1) using (case when "max_color_ebc"::text ~ '^[0-9]+[.]?[0-9]*$' then "max_color_ebc"::numeric(4,1) else null end);`,
    );
  }

  override down(): void {
    // Reverter para numeric(10,0)
    this.addSql(
      `alter table "beer_style" alter column "min_abv" type numeric(10,0) using ("min_abv"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_abv" type numeric(10,0) using ("max_abv"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_og" type numeric(10,0) using ("min_og"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_og" type numeric(10,0) using ("max_og"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_fg" type numeric(10,0) using ("min_fg"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_fg" type numeric(10,0) using ("max_fg"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_ibu" type varchar(255) using ("min_ibu"::text);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_ibu" type varchar(255) using ("max_ibu"::text);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "min_color_ebc" type varchar(255) using ("min_color_ebc"::text);`,
    );
    this.addSql(
      `alter table "beer_style" alter column "max_color_ebc" type varchar(255) using ("max_color_ebc"::text);`,
    );
  }
}
