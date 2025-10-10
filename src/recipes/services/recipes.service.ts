import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
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
import { RecipeCalculationsService } from './recipe-calculations.service';
import type { RecipeFermentableInput } from '../inputs/recipe-fermentable.input';
import type { RecipeHopInput } from '../inputs/recipe-hop.input';
import type { RecipeYeastInput } from '../inputs/recipe-yeast.input';
import type { RecipeWaterInput } from '../inputs/recipe-water.input';
import type { RecipeMashInput } from '../inputs/recipe-mash.input';
import type { RecipeFermentationInput } from '../inputs/recipe-fermentation.input';
import type { RecipeCarbonationInput } from '../inputs/recipe-carbonation.input';

@Injectable()
export class RecipesService extends BaseEntityService<Recipe> {
  constructor(
    em: EntityManager,
    private readonly recipeCalculations: RecipeCalculationsService,
  ) {
    super(em, Recipe);
  }

  async createRecipe(
    userId: string,
    input: RecipeUpsertInput,
  ): Promise<Recipe> {
    return await this.em.transactional(async (em) => {
      const recipe = this.createRecipeEntity(em, userId, input);
      em.persist(recipe);

      this.createCollectionRelations(em, recipe, input);
      this.createOneToOneRelations(em, recipe, input);

      await this.flushAndRecalculate(em, recipe);

      return recipe;
    });
  }

  async updateRecipe(
    userId: string,
    recipeId: string,
    input: RecipeUpsertInput,
  ): Promise<Recipe> {
    return await this.em.transactional(async (em) => {
      const recipe = await this.loadRecipeForUpdate(em, userId, recipeId);

      this.updateRecipeProperties(em, recipe, input);
      this.replaceCollectionRelations(recipe, input, em);
      this.createOneToOneRelations(em, recipe, input);

      await this.flushAndRecalculate(em, recipe);

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
    return em.create(Recipe, {
      ...input.recipe,
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
          'fermentables',
          'fermentables.fermentable',
          'hops',
          'hops.hop',
          'yeasts',
          'yeasts.yeast',
          'waters',
          'waters.waterProfile',
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
      em.assign(recipe, input.recipe);
    }
  }

  private async flushAndRecalculate(
    em: EntityManager,
    recipe: Recipe,
  ): Promise<void> {
    await em.flush();
    this.recipeCalculations.recalcAll(recipe);
    await em.flush();
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
