import { Module } from '@nestjs/common';
import { RecipesService } from './services/recipes.service';
import { RecipesController } from './controllers/recipes.controller';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
