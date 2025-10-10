import { Module } from '@nestjs/common';
import { RecipesService } from './services/recipes.service';
import { RecipesController } from './controllers/recipes.controller';
import { RecipeCalculationsService } from './services/recipe-calculations.service';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RecipeCalculationsService],
})
export class RecipesModule {}
