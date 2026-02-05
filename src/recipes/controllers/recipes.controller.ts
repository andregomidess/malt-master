import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { RecipesService } from '../services/recipes.service';
import { RecipeUpsertInput } from '../inputs/recipe-upsert.input';
import { RecipeQueryInput } from '../queries/recipe.query';
import { Recipe } from '../entities/recipe.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly em: EntityManager,
  ) {}

  @Get()
  async list(
    @Request() req: AuthenticatedRequest,
    @Query() query: RecipeQueryInput,
  ) {
    if (query.page && query.take) {
      return await this.recipesService.findAllPaginatedByUser(
        req.user.id,
        query,
      );
    }
    return await this.recipesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async getOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return await this.em.findOneOrFail(
      Recipe,
      {
        id,
        $or: [{ user: { id: req.user.id } }, { user: null }],
      },
      {
        populate: [
          'beerStyle',
          'equipment',
          'fermentables',
          'fermentables.fermentable',
          'hops',
          'hops.hop',
          'yeasts',
          'yeasts.yeast',
          'waters',
          'waters.waterProfile',
          'mash',
          'mash.mashProfile.steps',
          'fermentation',
          'fermentation.fermentationProfile',
          'carbonation',
          'carbonation.carbonationProfile',
        ],
      },
    );
  }

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() input: RecipeUpsertInput,
  ) {
    const recipe = await this.recipesService.createRecipe(req.user.id, input);

    return {
      id: recipe.id,
      name: recipe.name,
      type: recipe.type,
      originalGravity: recipe.originalGravity,
      finalGravity: recipe.finalGravity,
      estimatedIbu: recipe.estimatedIbu,
      estimatedColor: recipe.estimatedColor,
      estimatedAbv: recipe.estimatedAbv,
      plannedVolume: recipe.plannedVolume,
      createdAt: recipe.createdAt,
    };
  }

  @Put(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() input: RecipeUpsertInput,
  ) {
    return await this.recipesService.updateRecipe(req.user.id, id, input);
  }

  @Delete(':id')
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.recipesService.deleteRecipe(req.user.id, id);
    return { message: 'Recipe removed successfully' };
  }
}
