import { Migration } from '@mikro-orm/migrations';

export class Migration20251126010941_Init extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "carbonation_profile" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "type" text check ("type" in ('natural_priming', 'forced_co2', 'bottle_conditioning')) not null, "target_co2volumes" numeric(10,0) not null, "serving_temperature" numeric(10,0) not null default 4, "priming_sugar_type" text check ("priming_sugar_type" in ('table_sugar', 'corn_sugar', 'dme', 'honey', 'maple_syrup')) not null, "priming_sugar_amount" numeric(10,0) null, "keg_pressure" numeric(10,0) null, "carbonation_time" varchar(255) null, "carbonation_method" varchar(255) null, "observations" text null, "is_public" boolean not null default false, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "carbonation_profile_pkey" primary key ("id"));`);

    this.addSql(`create table "fermentation_profile" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "type" text check ("type" in ('primary', 'secondary', 'lagering', 'conditioning', 'bottle_conditioning', 'keg_conditioning')) not null, "yeast_strain" varchar(255) null, "target_final_gravity" numeric(10,0) null, "estimated_attenuation" numeric(10,0) null, "is_multi_stage" boolean not null default false, "observations" text null, "is_public" boolean not null default false, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "fermentation_profile_pkey" primary key ("id"));`);

    this.addSql(`create table "fermentation_step" ("id" uuid not null default uuid_generate_v4(), "fermentation_profile_id" uuid not null, "step_order" int not null, "name" varchar(255) not null, "temperature" numeric(10,0) not null, "duration" int not null, "target_gravity" numeric(10,0) null, "pressure_control" numeric(10,0) null, "is_ramping" boolean not null default false, "ramp_time" varchar(255) null, "ramp_to_temperature" numeric(10,0) null, "description" varchar(255) null, constraint "fermentation_step_pkey" primary key ("id"));`);

    this.addSql(`create table "mash_profile" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "type" text check ("type" in ('infusion', 'decoction', 'step_mash', 'biab')) not null, "estimated_efficiency" numeric(10,0) null, "grain_temperature" numeric(10,0) not null default 20, "tun_temperature" numeric(10,0) not null default 20, "sparge_temperature" numeric(10,0) not null default 78, "tun_weight" numeric(10,0) null, "tun_specific_heat" numeric(10,0) not null default 0.3, "mash_thickness" numeric(10,0) not null default 3, "observations" text null, "is_public" boolean not null default false, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "mash_profile_pkey" primary key ("id"));`);

    this.addSql(`create table "mash_step" ("id" uuid not null default uuid_generate_v4(), "mash_profile_id" uuid not null, "step_order" int not null, "name" varchar(255) not null, "step_type" text check ("step_type" in ('infusion', 'temperature', 'decoction')) not null, "temperature" numeric(10,0) not null, "duration" int not null, "infusion_amount" numeric(10,0) null, "infusion_temp" numeric(10,0) null, "decoction_amount" numeric(10,0) null, "ramp_time" varchar(255) null, "description" varchar(255) null, constraint "mash_step_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" uuid not null default uuid_generate_v4(), "username" varchar(255) not null, "picture_url" varchar(255) null, "country" varchar(255) not null, "role" varchar(255) not null default 'user', "status" varchar(255) not null default 'pending_verification', "gender" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "email_verification_token" varchar(255) null, "email_verified_at" varchar(255) null, "refresh_token" varchar(255) null, "password_reset_token" varchar(255) null, "password_reset_expiry" timestamptz null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "post" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid not null, "title" varchar(255) null, "content" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "category" varchar(255) null, constraint "post_pkey" primary key ("id"));`);

    this.addSql(`create table "inventory" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "inventory_pkey" primary key ("id"));`);
    this.addSql(`alter table "inventory" add constraint "inventory_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "hop" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid null, "name" varchar(255) not null, "alpha_acids" numeric(5,2) not null, "beta_acids" numeric(5,2) not null, "cohumulone" numeric(5,2) null, "total_oils" numeric(4,2) null, "form" text check ("form" in ('pellet', 'leaf', 'cryo', 'extract')) not null, "uses" jsonb not null, "aroma_flavor" text null, "harvest_year" smallint null, "storage_condition" varchar(255) null, "hsi" numeric(3,2) null, "cost_per_kilogram" numeric(7,2) null, "notes" text null, "origin" varchar(255) null, "supplier" varchar(255) null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "hop_pkey" primary key ("id"));`);
    this.addSql(`alter table "hop" add constraint "hop_name_unique" unique ("name");`);

    this.addSql(`create table "hop_inventory_item" ("id" uuid not null default uuid_generate_v4(), "inventory_id" uuid not null, "type" text check ("type" in ('fermentable', 'hop', 'yeast')) not null, "quantity" numeric(10,0) not null, "purchase_date" date null, "best_before_date" date null, "cost_per_unit" numeric(10,0) null, "notes" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "hop_id" uuid not null, "unit" varchar(255) not null, "alpha_acids_at_purchase" numeric(10,0) null, "harvest_year" varchar(255) null, "storage_condition" varchar(255) null, constraint "hop_inventory_item_pkey" primary key ("id"));`);

    this.addSql(`create table "fermentable" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid null, "name" varchar(255) not null, "type" text check ("type" in ('base', 'specialty', 'sugar', 'adjunct')) not null, "color" numeric(10,0) null, "yield" numeric(10,0) null, "origin" varchar(255) null, "supplier" varchar(255) null, "form" text check ("form" in ('grain', 'dry_extract', 'liquid_extract', 'syrup')) not null, "notes" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "fermentable_pkey" primary key ("id"));`);
    this.addSql(`alter table "fermentable" add constraint "fermentable_name_unique" unique ("name");`);

    this.addSql(`create table "fermentable_inventory_item" ("id" uuid not null default uuid_generate_v4(), "inventory_id" uuid not null, "type" text check ("type" in ('fermentable', 'hop', 'yeast')) not null, "quantity" numeric(10,0) not null, "purchase_date" date null, "best_before_date" date null, "cost_per_unit" numeric(10,0) null, "notes" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "fermentable_id" uuid not null, "unit" varchar(255) not null, "extract_potential" numeric(10,0) null, "lot_number" varchar(255) null, "moisture" numeric(10,0) null, "protein" numeric(10,0) null, constraint "fermentable_inventory_item_pkey" primary key ("id"));`);

    this.addSql(`create table "equipment" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid null, "name" varchar(255) not null, "description" text null, "total_capacity" numeric(10,2) not null, "usable_volume" numeric(10,2) not null, "type" text check ("type" in ('kettle', 'fermenter', 'chiller')) not null, "material" text check ("material" in ('stainless_steel', 'aluminum', 'plastic', 'glass', 'copper')) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, "kettle_loss" numeric(8,2) null, "evaporation_rate" numeric(5,2) null, "boil_off_rate" numeric(5,2) null, "heating_power" numeric(8,0) null, "heating_source" text check ("heating_source" in ('gas', 'electric', 'induction', 'steam', 'direct_fire')) null, "fermenter_loss" numeric(8,2) null, "cone_bottom_volume" numeric(8,2) null, "has_temperature_control" boolean null, "max_pressure" numeric(5,1) null, "cooling_type" text check ("cooling_type" in ('air_conditioning', 'glycol', 'immersion_coil', 'plate_chiller', 'natural')) null, "min_temperature" numeric(4,1) null, "max_temperature" numeric(4,1) null, "cooling_capacity" numeric(8,0) null, "flow_rate" numeric(6,2) null, "inlet_temperature" numeric(4,1) null, "outlet_temperature" numeric(4,1) null, "chiller_type" text check ("chiller_type" in ('counterflow', 'plate', 'immersion', 'ice_bath')) null, "tube_length" numeric(6,2) null, "tube_diameter" numeric(5,2) null, constraint "equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "equipment" add constraint "equipment_name_unique" unique ("name");`);
    this.addSql(`create index "equipment_type_index" on "equipment" ("type");`);

    this.addSql(`create table "beer_style" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "user_id" uuid null, "category" varchar(255) null, "sub_category" varchar(255) null, "min_abv" numeric(10,0) null, "max_abv" numeric(10,0) null, "min_og" numeric(10,0) null, "max_og" numeric(10,0) null, "min_fg" numeric(10,0) null, "max_fg" numeric(10,0) null, "min_ibu" varchar(255) null, "max_ibu" varchar(255) null, "min_color_ebc" varchar(255) null, "max_color_ebc" varchar(255) null, "description" text null, "aroma" text null, "appearance" text null, "flavor" text null, "mouthfeel" text null, "comments" text null, "history" text null, "ingredients" text null, "tags" jsonb not null, "examples" text null, "origin" varchar(255) null, "glassware" varchar(255) null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "beer_style_pkey" primary key ("id"));`);
    this.addSql(`alter table "beer_style" add constraint "beer_style_name_unique" unique ("name");`);

    this.addSql(`create table "recipe" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid null, "beer_style_id" uuid not null, "equipment_id" uuid null, "name" varchar(255) not null, "image_url" varchar(255) null, "about" text null, "notes" text null, "type" text check ("type" in ('all_grain', 'partial_mash', 'extract')) not null, "planned_volume" numeric(10,0) null, "final_volume" numeric(10,0) null, "original_gravity" numeric(10,0) null, "final_gravity" numeric(10,0) null, "estimated_ibu" numeric(10,0) null, "estimated_color" numeric(10,0) null, "estimated_abv" numeric(10,0) null, "planned_efficiency" numeric(10,0) null, "actual_efficiency" numeric(10,0) null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "brew_date" date null, constraint "recipe_pkey" primary key ("id"));`);

    this.addSql(`create table "recipe_mash" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid null, "mash_profile_id" uuid not null, "actual_efficiency" numeric(10,0) null, constraint "recipe_mash_pkey" primary key ("id"));`);
    this.addSql(`alter table "recipe_mash" add constraint "recipe_mash_recipe_id_unique" unique ("recipe_id");`);

    this.addSql(`create table "recipe_hop" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "hop_id" uuid not null, "amount" numeric(10,0) null, "boil_time" varchar(255) null, "stage" text check ("stage" in ('boil', 'whirlpool', 'dry_hop')) not null, constraint "recipe_hop_pkey" primary key ("id"));`);

    this.addSql(`create table "recipe_fermentation" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid null, "fermentation_profile_id" uuid not null, "actual_attenuation" numeric(10,0) null, "final_abv" numeric(10,0) null, "observations" text null, constraint "recipe_fermentation_pkey" primary key ("id"));`);
    this.addSql(`alter table "recipe_fermentation" add constraint "recipe_fermentation_recipe_id_unique" unique ("recipe_id");`);

    this.addSql(`create table "recipe_fermentable" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "fermentable_id" uuid not null, "amount" numeric(10,0) null, constraint "recipe_fermentable_pkey" primary key ("id"));`);

    this.addSql(`create table "recipe_equipment" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "equipment_id" uuid not null, constraint "recipe_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "recipe_equipment" add constraint "recipe_equipment_recipe_id_equipment_id_unique" unique ("recipe_id", "equipment_id");`);

    this.addSql(`create table "recipe_carbonation" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid null, "carbonation_profile_id" uuid not null, "amount_used" varchar(255) null, "temperature" numeric(10,0) null, "co2volumes" numeric(10,0) null, constraint "recipe_carbonation_pkey" primary key ("id"));`);
    this.addSql(`alter table "recipe_carbonation" add constraint "recipe_carbonation_recipe_id_unique" unique ("recipe_id");`);

    this.addSql(`create table "batch" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "user_id" uuid not null, "equipment_id" uuid null, "batch_code" varchar(255) null, "name" varchar(255) null, "brew_date" date null, "packaging_date" date null, "ready_date" date null, "status" text check ("status" in ('planned', 'fermenting', 'maturing', 'packaged', 'completed')) not null, "planned_volume" numeric(10,0) null, "final_volume" numeric(10,0) null, "actual_original_gravity" numeric(10,0) null, "actual_final_gravity" numeric(10,0) null, "actual_ibu" numeric(10,0) null, "actual_color" numeric(10,0) null, "actual_abv" numeric(10,0) null, "actual_efficiency" numeric(10,0) null, "fermentation_temperature" numeric(10,0) null, "fermentation_time" varchar(255) null, "actual_carbonation" numeric(10,0) null, "observations" text null, constraint "batch_pkey" primary key ("id"));`);

    this.addSql(`create table "tasting_note" ("id" uuid not null default uuid_generate_v4(), "batch_id" uuid not null, "user_id" uuid not null, "tasting_date" date not null default 'now()', "appearance_score" numeric(10,0) null, "aroma_score" numeric(10,0) null, "flavor_score" numeric(10,0) null, "mouthfeel_score" numeric(10,0) null, "overall_score" numeric(10,0) not null, "pros" text null, "cons" text null, "general_notes" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "tasting_note_pkey" primary key ("id"));`);

    this.addSql(`create table "batch_equipment" ("id" uuid not null default uuid_generate_v4(), "batch_id" uuid not null, "equipment_id" uuid not null, constraint "batch_equipment_pkey" primary key ("id"));`);
    this.addSql(`alter table "batch_equipment" add constraint "batch_equipment_batch_id_equipment_id_unique" unique ("batch_id", "equipment_id");`);

    this.addSql(`create table "water_profile" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "origin" varchar(255) null, "ca" numeric(5,2) null, "mg" numeric(5,2) null, "na" numeric(5,2) null, "so4" numeric(5,2) null, "cl" numeric(5,2) null, "hco3" numeric(5,2) null, "ph" numeric(3,2) null, "recommended_style" varchar(255) null, "notes" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "water_profile_pkey" primary key ("id"));`);
    this.addSql(`alter table "water_profile" add constraint "water_profile_name_unique" unique ("name");`);

    this.addSql(`create table "recipe_water" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "water_profile_id" uuid not null, "volume" numeric(10,0) null, "adjustments" text null, constraint "recipe_water_pkey" primary key ("id"));`);

    this.addSql(`create table "yeast" ("id" uuid not null default uuid_generate_v4(), "user_id" uuid null, "name" varchar(255) not null, "type" text check ("type" in ('ale', 'lager', 'wild', 'bacteria')) not null, "attenuation" numeric(5,2) null, "flocculation" text check ("flocculation" in ('low', 'medium', 'high')) not null, "min_temp" numeric(5,2) null, "max_temp" numeric(5,2) null, "format" text check ("format" in ('dry', 'liquid', 'slurry')) not null, "alcohol_tolerance" numeric(5,2) null, "origin" varchar(255) null, "supplier" varchar(255) null, "packaging_date" date null, "aroma_flavor" text null, "rehydration_notes" text null, "starter_notes" text null, "notes" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "yeast_pkey" primary key ("id"));`);
    this.addSql(`alter table "yeast" add constraint "yeast_name_supplier_unique" unique ("name", "supplier");`);

    this.addSql(`create table "recipe_yeast" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "yeast_id" uuid not null, "amount" varchar(255) null, "pitching_rate" varchar(255) null, "stage" text check ("stage" in ('primary', 'secondary', 'starter')) not null, constraint "recipe_yeast_pkey" primary key ("id"));`);

    this.addSql(`create table "yeast_inventory_item" ("id" uuid not null default uuid_generate_v4(), "inventory_id" uuid not null, "type" text check ("type" in ('fermentable', 'hop', 'yeast')) not null, "quantity" numeric(10,0) not null, "purchase_date" date null, "best_before_date" date null, "cost_per_unit" numeric(10,0) null, "notes" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "yeast_id" uuid not null, "unit" varchar(255) not null, "production_date" date null, "viability" numeric(10,0) null, "cell_count" bigint null, "starter" varchar(255) null, "pitching_rate" numeric(10,0) null, constraint "yeast_inventory_item_pkey" primary key ("id"));`);

    this.addSql(`alter table "fermentation_step" add constraint "fermentation_step_fermentation_profile_id_foreign" foreign key ("fermentation_profile_id") references "fermentation_profile" ("id") on update cascade;`);

    this.addSql(`alter table "mash_step" add constraint "mash_step_mash_profile_id_foreign" foreign key ("mash_profile_id") references "mash_profile" ("id") on update cascade;`);

    this.addSql(`alter table "post" add constraint "post_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "inventory" add constraint "inventory_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "hop" add constraint "hop_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "hop_inventory_item" add constraint "hop_inventory_item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade;`);
    this.addSql(`alter table "hop_inventory_item" add constraint "hop_inventory_item_hop_id_foreign" foreign key ("hop_id") references "hop" ("id") on update cascade;`);

    this.addSql(`alter table "fermentable" add constraint "fermentable_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "fermentable_inventory_item" add constraint "fermentable_inventory_item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade;`);
    this.addSql(`alter table "fermentable_inventory_item" add constraint "fermentable_inventory_item_fermentable_id_foreign" foreign key ("fermentable_id") references "fermentable" ("id") on update cascade;`);

    this.addSql(`alter table "equipment" add constraint "equipment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "beer_style" add constraint "beer_style_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "recipe" add constraint "recipe_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "recipe" add constraint "recipe_beer_style_id_foreign" foreign key ("beer_style_id") references "beer_style" ("id") on update cascade;`);
    this.addSql(`alter table "recipe" add constraint "recipe_equipment_id_foreign" foreign key ("equipment_id") references "equipment" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "recipe_mash" add constraint "recipe_mash_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on delete cascade;`);
    this.addSql(`alter table "recipe_mash" add constraint "recipe_mash_mash_profile_id_foreign" foreign key ("mash_profile_id") references "mash_profile" ("id") on update cascade;`);

    this.addSql(`alter table "recipe_hop" add constraint "recipe_hop_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;`);
    this.addSql(`alter table "recipe_hop" add constraint "recipe_hop_hop_id_foreign" foreign key ("hop_id") references "hop" ("id") on update cascade;`);

    this.addSql(`alter table "recipe_fermentation" add constraint "recipe_fermentation_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on delete cascade;`);
    this.addSql(`alter table "recipe_fermentation" add constraint "recipe_fermentation_fermentation_profile_id_foreign" foreign key ("fermentation_profile_id") references "fermentation_profile" ("id") on update cascade;`);

    this.addSql(`alter table "recipe_fermentable" add constraint "recipe_fermentable_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;`);
    this.addSql(`alter table "recipe_fermentable" add constraint "recipe_fermentable_fermentable_id_foreign" foreign key ("fermentable_id") references "fermentable" ("id") on update cascade;`);

    this.addSql(`alter table "recipe_equipment" add constraint "recipe_equipment_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;`);

    this.addSql(`alter table "recipe_carbonation" add constraint "recipe_carbonation_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on delete cascade;`);
    this.addSql(`alter table "recipe_carbonation" add constraint "recipe_carbonation_carbonation_profile_id_foreign" foreign key ("carbonation_profile_id") references "carbonation_profile" ("id") on update cascade;`);

    this.addSql(`alter table "batch" add constraint "batch_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;`);
    this.addSql(`alter table "batch" add constraint "batch_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "batch" add constraint "batch_equipment_id_foreign" foreign key ("equipment_id") references "equipment" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "tasting_note" add constraint "tasting_note_batch_id_foreign" foreign key ("batch_id") references "batch" ("id") on update cascade;`);
    this.addSql(`alter table "tasting_note" add constraint "tasting_note_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "batch_equipment" add constraint "batch_equipment_batch_id_foreign" foreign key ("batch_id") references "batch" ("id") on update cascade;`);

    this.addSql(`alter table "recipe_water" add constraint "recipe_water_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;`);
    this.addSql(`alter table "recipe_water" add constraint "recipe_water_water_profile_id_foreign" foreign key ("water_profile_id") references "water_profile" ("id") on update cascade;`);

    this.addSql(`alter table "yeast" add constraint "yeast_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "recipe_yeast" add constraint "recipe_yeast_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;`);
    this.addSql(`alter table "recipe_yeast" add constraint "recipe_yeast_yeast_id_foreign" foreign key ("yeast_id") references "yeast" ("id") on update cascade;`);

    this.addSql(`alter table "yeast_inventory_item" add constraint "yeast_inventory_item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade;`);
    this.addSql(`alter table "yeast_inventory_item" add constraint "yeast_inventory_item_yeast_id_foreign" foreign key ("yeast_id") references "yeast" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "recipe_carbonation" drop constraint "recipe_carbonation_carbonation_profile_id_foreign";`);

    this.addSql(`alter table "fermentation_step" drop constraint "fermentation_step_fermentation_profile_id_foreign";`);

    this.addSql(`alter table "recipe_fermentation" drop constraint "recipe_fermentation_fermentation_profile_id_foreign";`);

    this.addSql(`alter table "mash_step" drop constraint "mash_step_mash_profile_id_foreign";`);

    this.addSql(`alter table "recipe_mash" drop constraint "recipe_mash_mash_profile_id_foreign";`);

    this.addSql(`alter table "post" drop constraint "post_user_id_foreign";`);

    this.addSql(`alter table "inventory" drop constraint "inventory_user_id_foreign";`);

    this.addSql(`alter table "hop" drop constraint "hop_user_id_foreign";`);

    this.addSql(`alter table "fermentable" drop constraint "fermentable_user_id_foreign";`);

    this.addSql(`alter table "equipment" drop constraint "equipment_user_id_foreign";`);

    this.addSql(`alter table "beer_style" drop constraint "beer_style_user_id_foreign";`);

    this.addSql(`alter table "recipe" drop constraint "recipe_user_id_foreign";`);

    this.addSql(`alter table "batch" drop constraint "batch_user_id_foreign";`);

    this.addSql(`alter table "tasting_note" drop constraint "tasting_note_user_id_foreign";`);

    this.addSql(`alter table "yeast" drop constraint "yeast_user_id_foreign";`);

    this.addSql(`alter table "hop_inventory_item" drop constraint "hop_inventory_item_inventory_id_foreign";`);

    this.addSql(`alter table "fermentable_inventory_item" drop constraint "fermentable_inventory_item_inventory_id_foreign";`);

    this.addSql(`alter table "yeast_inventory_item" drop constraint "yeast_inventory_item_inventory_id_foreign";`);

    this.addSql(`alter table "hop_inventory_item" drop constraint "hop_inventory_item_hop_id_foreign";`);

    this.addSql(`alter table "recipe_hop" drop constraint "recipe_hop_hop_id_foreign";`);

    this.addSql(`alter table "fermentable_inventory_item" drop constraint "fermentable_inventory_item_fermentable_id_foreign";`);

    this.addSql(`alter table "recipe_fermentable" drop constraint "recipe_fermentable_fermentable_id_foreign";`);

    this.addSql(`alter table "recipe" drop constraint "recipe_equipment_id_foreign";`);

    this.addSql(`alter table "batch" drop constraint "batch_equipment_id_foreign";`);

    this.addSql(`alter table "recipe" drop constraint "recipe_beer_style_id_foreign";`);

    this.addSql(`alter table "recipe_mash" drop constraint "recipe_mash_recipe_id_foreign";`);

    this.addSql(`alter table "recipe_hop" drop constraint "recipe_hop_recipe_id_foreign";`);

    this.addSql(`alter table "recipe_fermentation" drop constraint "recipe_fermentation_recipe_id_foreign";`);

    this.addSql(`alter table "recipe_fermentable" drop constraint "recipe_fermentable_recipe_id_foreign";`);

    this.addSql(`alter table "recipe_equipment" drop constraint "recipe_equipment_recipe_id_foreign";`);

    this.addSql(`alter table "recipe_carbonation" drop constraint "recipe_carbonation_recipe_id_foreign";`);

    this.addSql(`alter table "batch" drop constraint "batch_recipe_id_foreign";`);

    this.addSql(`alter table "recipe_water" drop constraint "recipe_water_recipe_id_foreign";`);

    this.addSql(`alter table "recipe_yeast" drop constraint "recipe_yeast_recipe_id_foreign";`);

    this.addSql(`alter table "tasting_note" drop constraint "tasting_note_batch_id_foreign";`);

    this.addSql(`alter table "batch_equipment" drop constraint "batch_equipment_batch_id_foreign";`);

    this.addSql(`alter table "recipe_water" drop constraint "recipe_water_water_profile_id_foreign";`);

    this.addSql(`alter table "recipe_yeast" drop constraint "recipe_yeast_yeast_id_foreign";`);

    this.addSql(`alter table "yeast_inventory_item" drop constraint "yeast_inventory_item_yeast_id_foreign";`);
  }

}
