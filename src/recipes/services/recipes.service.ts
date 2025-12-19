import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Recipe } from '../entities/recipe.entity';
import { User } from 'src/users/entities/user.entity';
import { RecipeUpsertInput } from '../inputs/recipe-upsert.input';
import { RecipeFermentable } from '../entities/recipe-fermentable.entity';
import { RecipeHop } from '../entities/recipe-hop.entity';
import { RecipeYeast } from '../entities/recipe-yeast.entity';
import { RecipeWater } from '../entities/recipe-water.entity';
import { RecipeMash } from '../entities/recipe-mash.entity';
import { RecipeFermentation } from '../entities/recipe-fermentation.entity';
import { RecipeCarbonation } from '../entities/recipe-carbonation.entity';
import type { RecipeFermentableInput } from '../inputs/recipe-fermentable.input';
import type { RecipeHopInput } from '../inputs/recipe-hop.input';
import type { RecipeYeastInput } from '../inputs/recipe-yeast.input';
import type { RecipeWaterInput } from '../inputs/recipe-water.input';
import type { RecipeMashInput } from '../inputs/recipe-mash.input';
import type { RecipeFermentationInput } from '../inputs/recipe-fermentation.input';
import type { RecipeCarbonationInput } from '../inputs/recipe-carbonation.input';
import {
  RecipeQueryInput,
  RecipeSortBy,
  SortOrder,
} from '../queries/recipe.query';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class RecipesService extends BaseEntityService<Recipe> {
  constructor(em: EntityManager) {
    super(em, Recipe);
  }

  async findAllByUser(userId: string): Promise<Recipe[]> {
    return await this.em.find(
      Recipe,
      {
        $or: [{ user: { id: userId } }, { user: null }],
      },
      { orderBy: { createdAt: 'desc' } },
    );
  }

  async findAllPaginatedByUser(
    userId: string,
    query: RecipeQueryInput,
  ): Promise<PaginatedResult<Recipe>> {
    const where: FilterQuery<Recipe> = {
      $or: [{ user: { id: userId } }, { user: null }],
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.search) {
      const searchConditions = [
        { name: { $ilike: `%${query.search}%` } },
        { about: { $ilike: `%${query.search}%` } },
        { notes: { $ilike: `%${query.search}%` } },
      ];

      where.$and = [
        {
          $or: [{ user: { id: userId } }, { user: null }],
        },
        {
          $or: searchConditions,
        },
      ];
      delete where.$or;
    }

    const sortField = query.sortBy || RecipeSortBy.CREATED_AT;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<Recipe> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<Recipe>;

    const [data, total] = await this.em.findAndCount(Recipe, where, {
      orderBy,
      limit: query.limit,
      offset: query.offset,
      populate: ['beerStyle', 'equipment'],
    });

    return {
      data,
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.take),
    };
  }

  async createRecipe(
    userId: string,
    input: RecipeUpsertInput,
  ): Promise<Recipe> {
    return this.em.transactional((em) => {
      const recipe = this.createRecipeEntity(
        em as EntityManager,
        userId,
        input,
      );
      em.persist(recipe);

      this.createCollectionRelations(em as EntityManager, recipe, input);
      this.createOneToOneRelations(em as EntityManager, recipe, input);

      return recipe;
    });
  }

  async updateRecipe(
    userId: string,
    recipeId: string,
    input: RecipeUpsertInput,
  ): Promise<Recipe> {
    return await this.em.transactional(async (em) => {
      const recipe = await this.loadRecipeForUpdate(
        em as EntityManager,
        userId,
        recipeId,
      );

      this.updateRecipeProperties(em as EntityManager, recipe, input);
      this.replaceCollectionRelations(recipe, input, em as EntityManager);
      this.createOneToOneRelations(em as EntityManager, recipe, input);

      return recipe;
    });
  }

  async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    await this.em.transactional(async (em) => {
      const recipe = await em.findOneOrFail(Recipe, {
        id: recipeId,
        user: userId,
      });

      em.remove(recipe);
    });
  }

  private createRecipeEntity(
    em: EntityManager,
    userId: string,
    input: RecipeUpsertInput,
  ): Recipe {
    const userRef = em.getReference(User, userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, ...recipeData } = input.recipe;
    return em.create(Recipe, {
      ...recipeData,
      user: userRef,
    });
  }

  private async loadRecipeForUpdate(
    em: EntityManager,
    userId: string,
    recipeId: string,
  ): Promise<Recipe> {
    return await em.findOneOrFail(
      Recipe,
      { id: recipeId, user: userId },
      {
        populate: [
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
          'mash.mashProfile',
        ],
      },
    );
  }

  private updateRecipeProperties(
    em: EntityManager,
    recipe: Recipe,
    input: RecipeUpsertInput,
  ): void {
    if (input.recipe) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, ...recipeData } = input.recipe;

      if (recipeData.name !== undefined) {
        recipe.name = recipeData.name;
      }
      if (recipeData.imageUrl !== undefined) {
        recipe.imageUrl = recipeData.imageUrl;
      }
      if (recipeData.about !== undefined) {
        recipe.about = recipeData.about;
      }
      if (recipeData.notes !== undefined) {
        recipe.notes = recipeData.notes;
      }
      if (recipeData.type !== undefined) {
        recipe.type = recipeData.type;
      }
      if (recipeData.beerStyle !== undefined) {
        recipe.beerStyle = recipeData.beerStyle;
      }
      if (recipeData.equipment !== undefined) {
        recipe.equipment = recipeData.equipment;
      }
      if (recipeData.brewDate !== undefined) {
        recipe.brewDate = recipeData.brewDate
          ? new Date(recipeData.brewDate)
          : null;
      }

      const convertToNumber = (value: unknown): number | null => {
        if (value === null || value === undefined) {
          return null;
        }
        if (typeof value === 'number') {
          return value;
        }
        if (typeof value === 'string') {
          const numValue = parseFloat(value);
          return isNaN(numValue) ? null : numValue;
        }
        return null;
      };

      if (recipeData.plannedVolume !== undefined) {
        recipe.plannedVolume = convertToNumber(recipeData.plannedVolume);
      }
      if (recipeData.finalVolume !== undefined) {
        recipe.finalVolume = convertToNumber(recipeData.finalVolume);
      }
      if (recipeData.mashVolume !== undefined) {
        recipe.mashVolume = convertToNumber(recipeData.mashVolume);
      }
      if (recipeData.boilTime !== undefined) {
        recipe.boilTime = convertToNumber(recipeData.boilTime);
      }
      if (recipeData.originalGravity !== undefined) {
        recipe.originalGravity = convertToNumber(recipeData.originalGravity);
      }
      if (recipeData.finalGravity !== undefined) {
        recipe.finalGravity = convertToNumber(recipeData.finalGravity);
      }
      if (recipeData.estimatedIbu !== undefined) {
        recipe.estimatedIbu = convertToNumber(recipeData.estimatedIbu);
      }
      if (recipeData.estimatedColor !== undefined) {
        recipe.estimatedColor = convertToNumber(recipeData.estimatedColor);
      }
      if (recipeData.estimatedAbv !== undefined) {
        recipe.estimatedAbv = convertToNumber(recipeData.estimatedAbv);
      }
      if (recipeData.plannedEfficiency !== undefined) {
        recipe.plannedEfficiency = convertToNumber(
          recipeData.plannedEfficiency,
        );
      }
      if (recipeData.actualEfficiency !== undefined) {
        recipe.actualEfficiency = convertToNumber(recipeData.actualEfficiency);
      }
    }
  }

  private createCollectionRelations(
    em: EntityManager,
    recipe: Recipe,
    input: RecipeUpsertInput,
  ): void {
    this.createFermentables(em, recipe, input.fermentables);
    this.createHops(em, recipe, input.hops);
    this.createYeasts(em, recipe, input.yeasts);
    this.createWaters(em, recipe, input.waters);
  }

  private replaceCollectionRelations(
    recipe: Recipe,
    input: RecipeUpsertInput,
    em: EntityManager,
  ): void {
    recipe.fermentables.removeAll();
    recipe.hops.removeAll();
    recipe.yeasts.removeAll();
    recipe.waters.removeAll();

    this.addFermentables(recipe, input.fermentables, em);
    this.addHops(recipe, input.hops, em);
    this.addYeasts(recipe, input.yeasts, em);
    this.addWaters(recipe, input.waters, em);
  }

  private createFermentables(
    em: EntityManager,
    recipe: Recipe,
    inputs: RecipeFermentableInput[],
  ): void {
    for (const input of inputs) {
      const entity = em.create(RecipeFermentable, {
        recipe,
        fermentable: input.fermentable,
        amount: input.amount ?? null,
      });
      em.persist(entity);
    }
  }

  private addFermentables(
    recipe: Recipe,
    inputs: RecipeFermentableInput[],
    em: EntityManager,
  ): void {
    for (const input of inputs) {
      recipe.fermentables.add(
        em.create(RecipeFermentable, {
          recipe,
          fermentable: input.fermentable,
          amount: input.amount ?? null,
        }),
      );
    }
  }

  private createHops(
    em: EntityManager,
    recipe: Recipe,
    inputs: RecipeHopInput[],
  ): void {
    for (const input of inputs) {
      const entity = em.create(RecipeHop, {
        recipe,
        hop: input.hop,
        amount: input.amount ?? null,
        boilTime: input.boilTime ?? null,
        stage: input.stage,
      });
      em.persist(entity);
    }
  }

  private addHops(
    recipe: Recipe,
    inputs: RecipeHopInput[],
    em: EntityManager,
  ): void {
    for (const input of inputs) {
      recipe.hops.add(
        em.create(RecipeHop, {
          recipe,
          hop: input.hop,
          amount: input.amount ?? null,
          boilTime: input.boilTime ?? null,
          stage: input.stage,
        }),
      );
    }
  }

  private createYeasts(
    em: EntityManager,
    recipe: Recipe,
    inputs: RecipeYeastInput[],
  ): void {
    for (const input of inputs) {
      const entity = em.create(RecipeYeast, {
        recipe,
        yeast: input.yeast,
        amount: input.amount ?? null,
        pitchingRate: input.pitchingRate ?? null,
        stage: input.stage,
      });
      em.persist(entity);
    }
  }

  private addYeasts(
    recipe: Recipe,
    inputs: RecipeYeastInput[],
    em: EntityManager,
  ): void {
    for (const input of inputs) {
      recipe.yeasts.add(
        em.create(RecipeYeast, {
          recipe,
          yeast: input.yeast,
          amount: input.amount ?? null,
          pitchingRate: input.pitchingRate ?? null,
          stage: input.stage,
        }),
      );
    }
  }

  private createWaters(
    em: EntityManager,
    recipe: Recipe,
    inputs: RecipeWaterInput[],
  ): void {
    for (const input of inputs) {
      const entity = em.create(RecipeWater, {
        recipe,
        waterProfile: input.waterProfile,
        volume: input.volume ?? null,
        adjustments: input.adjustments ?? null,
      });
      em.persist(entity);
    }
  }

  private addWaters(
    recipe: Recipe,
    inputs: RecipeWaterInput[],
    em: EntityManager,
  ): void {
    for (const input of inputs) {
      recipe.waters.add(
        em.create(RecipeWater, {
          recipe,
          waterProfile: input.waterProfile,
          volume: input.volume ?? null,
          adjustments: input.adjustments ?? null,
        }),
      );
    }
  }

  private createOneToOneRelations(
    em: EntityManager,
    recipe: Recipe,
    input: RecipeUpsertInput,
  ): void {
    this.createMash(em, recipe, input.mash);
    this.createFermentation(em, recipe, input.fermentation);
    this.createCarbonation(em, recipe, input.carbonation);
  }

  private createMash(
    em: EntityManager,
    recipe: Recipe,
    input?: RecipeMashInput,
  ): void {
    if (!input) return;

    const entity = em.create(RecipeMash, {
      recipe,
      mashProfile: input.mashProfile,
      actualEfficiency: input.actualEfficiency ?? null,
    });
    em.persist(entity);
  }

  private createFermentation(
    em: EntityManager,
    recipe: Recipe,
    input?: RecipeFermentationInput,
  ): void {
    if (!input) return;

    const entity = em.create(RecipeFermentation, {
      recipe,
      fermentationProfile: input.fermentationProfile,
      actualAttenuation: input.actualAttenuation ?? null,
      finalAbv: input.finalAbv ?? null,
      observations: input.observations ?? null,
    });
    em.persist(entity);
  }

  private createCarbonation(
    em: EntityManager,
    recipe: Recipe,
    input?: RecipeCarbonationInput,
  ): void {
    if (!input) return;

    const entity = em.create(RecipeCarbonation, {
      recipe,
      carbonationProfile: input.carbonationProfile,
      amountUsed: input.amountUsed ?? null,
      temperature: input.temperature ?? null,
      co2Volumes: input.co2Volumes ?? null,
    });
    em.persist(entity);
  }
}
