import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RecipesService } from './services/recipes.service';
import { RecipesController } from './controllers/recipes.controller';
import { Recipe } from './entities/recipe.entity';
import { RecipeFermentable } from './entities/recipe-fermentable.entity';
import { RecipeHop } from './entities/recipe-hop.entity';
import { RecipeYeast } from './entities/recipe-yeast.entity';
import { RecipeMash } from './entities/recipe-mash.entity';
import { RecipeFermentation } from './entities/recipe-fermentation.entity';
import { RecipeCarbonation } from './entities/recipe-carbonation.entity';
import { RecipeWater } from './entities/recipe-water.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Recipe,
      RecipeFermentable,
      RecipeHop,
      RecipeYeast,
      RecipeMash,
      RecipeFermentation,
      RecipeCarbonation,
      RecipeWater,
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
