import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeInput } from './recipe.input';
import { RecipeFermentableInput } from './recipe-fermentable.input';
import { RecipeHopInput } from './recipe-hop.input';
import { RecipeYeastInput } from './recipe-yeast.input';
import { RecipeWaterInput } from './recipe-water.input';
import { RecipeMashInput } from './recipe-mash.input';
import { RecipeFermentationInput } from './recipe-fermentation.input';
import { RecipeCarbonationInput } from './recipe-carbonation.input';

export class RecipeUpsertInput {
  @ValidateNested()
  @Type(() => RecipeInput)
  recipe!: RecipeInput;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeFermentableInput)
  fermentables: RecipeFermentableInput[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeHopInput)
  hops: RecipeHopInput[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeYeastInput)
  yeasts: RecipeYeastInput[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeWaterInput)
  waters: RecipeWaterInput[] = [];

  @IsOptional()
  @ValidateNested()
  @Type(() => RecipeMashInput)
  mash?: RecipeMashInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecipeFermentationInput)
  fermentation?: RecipeFermentationInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecipeCarbonationInput)
  carbonation?: RecipeCarbonationInput;
}
