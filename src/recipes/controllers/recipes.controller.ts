import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { RecipesService } from '../services/recipes.service';
import { RecipeUpsertInput } from '../inputs/recipe-upsert.input';
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
  async list(@Request() req: AuthenticatedRequest) {
    return await this.em.find(
      Recipe,
      { user: req.user.id },
      { orderBy: { createdAt: 'desc' } },
    );
  }

  @Get(':id')
  async getOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return await this.em.findOneOrFail(
      Recipe,
      { id, user: req.user.id },
      { populate: ['fermentables', 'hops', 'yeasts', 'waters'] },
    );
  }

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() input: RecipeUpsertInput,
  ) {
    return await this.recipesService.createRecipe(req.user.id, input);
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
