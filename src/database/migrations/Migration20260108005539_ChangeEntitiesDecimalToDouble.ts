import { Migration } from '@mikro-orm/migrations';

export class Migration20260108005539_ChangeEntitiesDecimalToDouble extends Migration {
  override up(): void {
    this.addSql(
      `alter table "mash_profile" alter column "estimated_efficiency" type double precision using ("estimated_efficiency"::double precision);`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "grain_temperature" type double precision using ("grain_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "tun_temperature" type double precision using ("tun_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "sparge_temperature" type double precision using ("sparge_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "tun_weight" type double precision using ("tun_weight"::double precision);`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "tun_specific_heat" type double precision using ("tun_specific_heat"::double precision);`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "mash_thickness" type double precision using ("mash_thickness"::double precision);`,
    );

    this.addSql(
      `alter table "mash_step" alter column "temperature" type double precision using ("temperature"::double precision);`,
    );
    this.addSql(
      `alter table "mash_step" alter column "infusion_amount" type double precision using ("infusion_amount"::double precision);`,
    );
    this.addSql(
      `alter table "mash_step" alter column "infusion_temp" type double precision using ("infusion_temp"::double precision);`,
    );
    this.addSql(
      `alter table "mash_step" alter column "decoction_amount" type double precision using ("decoction_amount"::double precision);`,
    );

    this.addSql(
      `alter table "hop" alter column "alpha_acids" type double precision using ("alpha_acids"::double precision);`,
    );
    this.addSql(
      `alter table "hop" alter column "beta_acids" type double precision using ("beta_acids"::double precision);`,
    );
    this.addSql(
      `alter table "hop" alter column "cohumulone" type double precision using ("cohumulone"::double precision);`,
    );
    this.addSql(
      `alter table "hop" alter column "total_oils" type double precision using ("total_oils"::double precision);`,
    );
    this.addSql(
      `alter table "hop" alter column "hsi" type double precision using ("hsi"::double precision);`,
    );
    this.addSql(
      `alter table "hop" alter column "cost_per_kilogram" type double precision using ("cost_per_kilogram"::double precision);`,
    );

    this.addSql(
      `alter table "hop_inventory_item" alter column "quantity" type double precision using ("quantity"::double precision);`,
    );
    this.addSql(
      `alter table "hop_inventory_item" alter column "cost_per_unit" type double precision using ("cost_per_unit"::double precision);`,
    );
    this.addSql(
      `alter table "hop_inventory_item" alter column "alpha_acids_at_purchase" type double precision using ("alpha_acids_at_purchase"::double precision);`,
    );

    this.addSql(
      `alter table "fermentation_profile" alter column "target_final_gravity" type double precision using ("target_final_gravity"::double precision);`,
    );
    this.addSql(
      `alter table "fermentation_profile" alter column "estimated_attenuation" type double precision using ("estimated_attenuation"::double precision);`,
    );

    this.addSql(
      `alter table "fermentation_step" alter column "temperature" type double precision using ("temperature"::double precision);`,
    );
    this.addSql(
      `alter table "fermentation_step" alter column "target_gravity" type double precision using ("target_gravity"::double precision);`,
    );
    this.addSql(
      `alter table "fermentation_step" alter column "pressure_control" type double precision using ("pressure_control"::double precision);`,
    );
    this.addSql(
      `alter table "fermentation_step" alter column "ramp_to_temperature" type double precision using ("ramp_to_temperature"::double precision);`,
    );

    this.addSql(
      `alter table "fermentable" alter column "color" type double precision using ("color"::double precision);`,
    );
    this.addSql(
      `alter table "fermentable" alter column "yield" type double precision using ("yield"::double precision);`,
    );

    this.addSql(
      `alter table "fermentable_inventory_item" alter column "quantity" type double precision using ("quantity"::double precision);`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "cost_per_unit" type double precision using ("cost_per_unit"::double precision);`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "extract_potential" type double precision using ("extract_potential"::double precision);`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "moisture" type double precision using ("moisture"::double precision);`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "protein" type double precision using ("protein"::double precision);`,
    );

    this.addSql(
      `alter table "equipment" alter column "total_capacity" type double precision using ("total_capacity"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "usable_volume" type double precision using ("usable_volume"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "kettle_loss" type double precision using ("kettle_loss"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "evaporation_rate" type double precision using ("evaporation_rate"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "boil_off_rate" type double precision using ("boil_off_rate"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "heating_power" type double precision using ("heating_power"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "fermenter_loss" type double precision using ("fermenter_loss"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "cone_bottom_volume" type double precision using ("cone_bottom_volume"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "max_pressure" type double precision using ("max_pressure"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "min_temperature" type double precision using ("min_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "max_temperature" type double precision using ("max_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "cooling_capacity" type double precision using ("cooling_capacity"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "flow_rate" type double precision using ("flow_rate"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "inlet_temperature" type double precision using ("inlet_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "outlet_temperature" type double precision using ("outlet_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "tube_length" type double precision using ("tube_length"::double precision);`,
    );
    this.addSql(
      `alter table "equipment" alter column "tube_diameter" type double precision using ("tube_diameter"::double precision);`,
    );

    this.addSql(
      `alter table "carbonation_profile" alter column "target_co2volumes" type double precision using ("target_co2volumes"::double precision);`,
    );
    this.addSql(
      `alter table "carbonation_profile" alter column "serving_temperature" type double precision using ("serving_temperature"::double precision);`,
    );
    this.addSql(
      `alter table "carbonation_profile" alter column "priming_sugar_amount" type double precision using ("priming_sugar_amount"::double precision);`,
    );
    this.addSql(
      `alter table "carbonation_profile" alter column "keg_pressure" type double precision using ("keg_pressure"::double precision);`,
    );

    this.addSql(
      `alter table "recipe" alter column "planned_volume" type double precision using ("planned_volume"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "final_volume" type double precision using ("final_volume"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "original_gravity" type double precision using ("original_gravity"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "final_gravity" type double precision using ("final_gravity"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "estimated_ibu" type double precision using ("estimated_ibu"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "estimated_color" type double precision using ("estimated_color"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "estimated_abv" type double precision using ("estimated_abv"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "planned_efficiency" type double precision using ("planned_efficiency"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "actual_efficiency" type double precision using ("actual_efficiency"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "mash_volume" type double precision using ("mash_volume"::double precision);`,
    );
    this.addSql(
      `alter table "recipe" alter column "boil_time" type double precision using ("boil_time"::double precision);`,
    );

    this.addSql(
      `alter table "recipe_mash" alter column "actual_efficiency" type double precision using ("actual_efficiency"::double precision);`,
    );

    this.addSql(
      `alter table "recipe_hop" alter column "amount" type double precision using ("amount"::double precision);`,
    );

    this.addSql(
      `alter table "recipe_fermentation" alter column "actual_attenuation" type double precision using ("actual_attenuation"::double precision);`,
    );
    this.addSql(
      `alter table "recipe_fermentation" alter column "final_abv" type double precision using ("final_abv"::double precision);`,
    );

    this.addSql(
      `alter table "recipe_fermentable" alter column "amount" type double precision using ("amount"::double precision);`,
    );

    this.addSql(
      `alter table "recipe_carbonation" alter column "temperature" type double precision using ("temperature"::double precision);`,
    );
    this.addSql(
      `alter table "recipe_carbonation" alter column "co2volumes" type double precision using ("co2volumes"::double precision);`,
    );

    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" set default 'now()';`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "appearance_score" type double precision using ("appearance_score"::double precision);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "aroma_score" type double precision using ("aroma_score"::double precision);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "flavor_score" type double precision using ("flavor_score"::double precision);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "mouthfeel_score" type double precision using ("mouthfeel_score"::double precision);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "overall_score" type double precision using ("overall_score"::double precision);`,
    );

    this.addSql(
      `alter table "water_profile" alter column "ca" type double precision using ("ca"::double precision);`,
    );
    this.addSql(
      `alter table "water_profile" alter column "mg" type double precision using ("mg"::double precision);`,
    );
    this.addSql(
      `alter table "water_profile" alter column "na" type double precision using ("na"::double precision);`,
    );
    this.addSql(
      `alter table "water_profile" alter column "so4" type double precision using ("so4"::double precision);`,
    );
    this.addSql(
      `alter table "water_profile" alter column "cl" type double precision using ("cl"::double precision);`,
    );
    this.addSql(
      `alter table "water_profile" alter column "hco3" type double precision using ("hco3"::double precision);`,
    );
    this.addSql(
      `alter table "water_profile" alter column "ph" type double precision using ("ph"::double precision);`,
    );

    this.addSql(
      `alter table "recipe_water" alter column "volume" type double precision using ("volume"::double precision);`,
    );

    this.addSql(
      `alter table "yeast" alter column "attenuation" type double precision using ("attenuation"::double precision);`,
    );
    this.addSql(
      `alter table "yeast" alter column "min_temp" type double precision using ("min_temp"::double precision);`,
    );
    this.addSql(
      `alter table "yeast" alter column "max_temp" type double precision using ("max_temp"::double precision);`,
    );
    this.addSql(
      `alter table "yeast" alter column "alcohol_tolerance" type double precision using ("alcohol_tolerance"::double precision);`,
    );

    this.addSql(
      `alter table "yeast_inventory_item" alter column "quantity" type double precision using ("quantity"::double precision);`,
    );
    this.addSql(
      `alter table "yeast_inventory_item" alter column "cost_per_unit" type double precision using ("cost_per_unit"::double precision);`,
    );
    this.addSql(
      `alter table "yeast_inventory_item" alter column "viability" type double precision using ("viability"::double precision);`,
    );
    this.addSql(
      `alter table "yeast_inventory_item" alter column "pitching_rate" type double precision using ("pitching_rate"::double precision);`,
    );
  }

  override down(): void {
    this.addSql(
      `create table "batch_equipment" ("id" uuid not null default uuid_generate_v4(), "batch_id" uuid not null, "equipment_id" uuid not null, constraint "batch_equipment_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "batch_equipment" add constraint "batch_equipment_batch_id_equipment_id_unique" unique ("batch_id", "equipment_id");`,
    );

    this.addSql(
      `create table "recipe_equipment" ("id" uuid not null default uuid_generate_v4(), "recipe_id" uuid not null, "equipment_id" uuid not null, constraint "recipe_equipment_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "recipe_equipment" add constraint "recipe_equipment_recipe_id_equipment_id_unique" unique ("recipe_id", "equipment_id");`,
    );

    this.addSql(
      `alter table "carbonation_profile" alter column "target_co2volumes" type numeric(10,0) using ("target_co2volumes"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "carbonation_profile" alter column "serving_temperature" type numeric(10,0) using ("serving_temperature"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "carbonation_profile" alter column "priming_sugar_amount" type numeric(10,0) using ("priming_sugar_amount"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "carbonation_profile" alter column "keg_pressure" type numeric(10,0) using ("keg_pressure"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "equipment" alter column "total_capacity" type numeric(10,2) using ("total_capacity"::numeric(10,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "usable_volume" type numeric(10,2) using ("usable_volume"::numeric(10,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "kettle_loss" type numeric(8,2) using ("kettle_loss"::numeric(8,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "evaporation_rate" type numeric(5,2) using ("evaporation_rate"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "boil_off_rate" type numeric(5,2) using ("boil_off_rate"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "heating_power" type numeric(8,0) using ("heating_power"::numeric(8,0));`,
    );
    this.addSql(
      `alter table "equipment" alter column "fermenter_loss" type numeric(8,2) using ("fermenter_loss"::numeric(8,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "cone_bottom_volume" type numeric(8,2) using ("cone_bottom_volume"::numeric(8,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "max_pressure" type numeric(5,1) using ("max_pressure"::numeric(5,1));`,
    );
    this.addSql(
      `alter table "equipment" alter column "min_temperature" type numeric(4,1) using ("min_temperature"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "equipment" alter column "max_temperature" type numeric(4,1) using ("max_temperature"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "equipment" alter column "cooling_capacity" type numeric(8,0) using ("cooling_capacity"::numeric(8,0));`,
    );
    this.addSql(
      `alter table "equipment" alter column "flow_rate" type numeric(6,2) using ("flow_rate"::numeric(6,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "inlet_temperature" type numeric(4,1) using ("inlet_temperature"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "equipment" alter column "outlet_temperature" type numeric(4,1) using ("outlet_temperature"::numeric(4,1));`,
    );
    this.addSql(
      `alter table "equipment" alter column "tube_length" type numeric(6,2) using ("tube_length"::numeric(6,2));`,
    );
    this.addSql(
      `alter table "equipment" alter column "tube_diameter" type numeric(5,2) using ("tube_diameter"::numeric(5,2));`,
    );

    this.addSql(
      `alter table "fermentable" alter column "color" type numeric(10,0) using ("color"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentable" alter column "yield" type numeric(10,0) using ("yield"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "fermentable_inventory_item" alter column "quantity" type numeric(10,0) using ("quantity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "cost_per_unit" type numeric(10,0) using ("cost_per_unit"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "extract_potential" type numeric(10,0) using ("extract_potential"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "moisture" type numeric(10,0) using ("moisture"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentable_inventory_item" alter column "protein" type numeric(10,0) using ("protein"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "fermentation_profile" alter column "target_final_gravity" type numeric(10,0) using ("target_final_gravity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentation_profile" alter column "estimated_attenuation" type numeric(10,0) using ("estimated_attenuation"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "fermentation_step" alter column "temperature" type numeric(10,0) using ("temperature"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentation_step" alter column "target_gravity" type numeric(10,0) using ("target_gravity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentation_step" alter column "pressure_control" type numeric(10,0) using ("pressure_control"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "fermentation_step" alter column "ramp_to_temperature" type numeric(10,0) using ("ramp_to_temperature"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "hop" alter column "alpha_acids" type numeric(5,2) using ("alpha_acids"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "hop" alter column "beta_acids" type numeric(5,2) using ("beta_acids"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "hop" alter column "cohumulone" type numeric(5,2) using ("cohumulone"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "hop" alter column "total_oils" type numeric(4,2) using ("total_oils"::numeric(4,2));`,
    );
    this.addSql(
      `alter table "hop" alter column "hsi" type numeric(3,2) using ("hsi"::numeric(3,2));`,
    );
    this.addSql(
      `alter table "hop" alter column "cost_per_kilogram" type numeric(7,2) using ("cost_per_kilogram"::numeric(7,2));`,
    );

    this.addSql(
      `alter table "hop_inventory_item" alter column "quantity" type numeric(10,0) using ("quantity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "hop_inventory_item" alter column "cost_per_unit" type numeric(10,0) using ("cost_per_unit"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "hop_inventory_item" alter column "alpha_acids_at_purchase" type numeric(10,0) using ("alpha_acids_at_purchase"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "mash_profile" alter column "estimated_efficiency" type numeric(5,2) using ("estimated_efficiency"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "grain_temperature" type numeric(5,2) using ("grain_temperature"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "tun_temperature" type numeric(5,2) using ("tun_temperature"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "sparge_temperature" type numeric(5,2) using ("sparge_temperature"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "tun_weight" type numeric(8,2) using ("tun_weight"::numeric(8,2));`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "tun_specific_heat" type numeric(3,2) using ("tun_specific_heat"::numeric(3,2));`,
    );
    this.addSql(
      `alter table "mash_profile" alter column "mash_thickness" type numeric(4,2) using ("mash_thickness"::numeric(4,2));`,
    );

    this.addSql(
      `alter table "mash_step" alter column "temperature" type numeric(10,0) using ("temperature"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "mash_step" alter column "infusion_amount" type numeric(10,0) using ("infusion_amount"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "mash_step" alter column "infusion_temp" type numeric(10,0) using ("infusion_temp"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "mash_step" alter column "decoction_amount" type numeric(10,0) using ("decoction_amount"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "recipe" alter column "planned_volume" type numeric(10,0) using ("planned_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "final_volume" type numeric(10,0) using ("final_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "mash_volume" type numeric(10,0) using ("mash_volume"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "boil_time" type numeric(10,0) using ("boil_time"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "original_gravity" type numeric(10,0) using ("original_gravity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "final_gravity" type numeric(10,0) using ("final_gravity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "estimated_ibu" type numeric(10,0) using ("estimated_ibu"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "estimated_color" type numeric(10,0) using ("estimated_color"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "estimated_abv" type numeric(10,0) using ("estimated_abv"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "planned_efficiency" type numeric(10,0) using ("planned_efficiency"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe" alter column "actual_efficiency" type numeric(10,0) using ("actual_efficiency"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "recipe_carbonation" alter column "temperature" type numeric(10,0) using ("temperature"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe_carbonation" alter column "co2volumes" type numeric(10,0) using ("co2volumes"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "recipe_fermentable" alter column "amount" type numeric(10,0) using ("amount"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "recipe_fermentation" alter column "actual_attenuation" type numeric(10,0) using ("actual_attenuation"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "recipe_fermentation" alter column "final_abv" type numeric(10,0) using ("final_abv"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "recipe_hop" alter column "amount" type numeric(10,0) using ("amount"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "recipe_mash" alter column "actual_efficiency" type numeric(10,0) using ("actual_efficiency"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "recipe_water" alter column "volume" type numeric(10,0) using ("volume"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" type date using ("tasting_date"::date);`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "tasting_date" set default '2025-12-05';`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "appearance_score" type numeric(10,0) using ("appearance_score"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "aroma_score" type numeric(10,0) using ("aroma_score"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "flavor_score" type numeric(10,0) using ("flavor_score"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "mouthfeel_score" type numeric(10,0) using ("mouthfeel_score"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "tasting_note" alter column "overall_score" type numeric(10,0) using ("overall_score"::numeric(10,0));`,
    );

    this.addSql(
      `alter table "water_profile" alter column "ca" type numeric(5,2) using ("ca"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "water_profile" alter column "mg" type numeric(5,2) using ("mg"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "water_profile" alter column "na" type numeric(5,2) using ("na"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "water_profile" alter column "so4" type numeric(5,2) using ("so4"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "water_profile" alter column "cl" type numeric(5,2) using ("cl"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "water_profile" alter column "hco3" type numeric(5,2) using ("hco3"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "water_profile" alter column "ph" type numeric(3,2) using ("ph"::numeric(3,2));`,
    );

    this.addSql(
      `alter table "yeast" alter column "attenuation" type numeric(5,2) using ("attenuation"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "yeast" alter column "min_temp" type numeric(5,2) using ("min_temp"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "yeast" alter column "max_temp" type numeric(5,2) using ("max_temp"::numeric(5,2));`,
    );
    this.addSql(
      `alter table "yeast" alter column "alcohol_tolerance" type numeric(5,2) using ("alcohol_tolerance"::numeric(5,2));`,
    );

    this.addSql(
      `alter table "yeast_inventory_item" alter column "quantity" type numeric(10,0) using ("quantity"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "yeast_inventory_item" alter column "cost_per_unit" type numeric(10,0) using ("cost_per_unit"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "yeast_inventory_item" alter column "viability" type numeric(10,0) using ("viability"::numeric(10,0));`,
    );
    this.addSql(
      `alter table "yeast_inventory_item" alter column "pitching_rate" type numeric(10,0) using ("pitching_rate"::numeric(10,0));`,
    );
  }
}
