import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class RecipesService extends BaseEntityService<Recipe> {
  constructor(em: EntityManager) {
    super(em, Recipe);
  }

  async createRecipe(
    userId: string,
    input: RecipeUpsertInput,
  ): Promise<Recipe> {
    return await this.em.transactional(async (em) => {
      const userRef = em.getReference(User, userId);

      const recipe = em.create(Recipe, {
        ...input.recipe,
        user: userRef,
      });
      em.persist(recipe);

      if (input.fermentables?.length) {
        for (const f of input.fermentables) {
          const rf = em.create(RecipeFermentable, {
            recipe,
            fermentable: f.fermentable,
            amount: f.amount ?? null,
          });
          em.persist(rf);
        }
      }

      if (input.hops?.length) {
        for (const h of input.hops) {
          const rh = em.create(RecipeHop, {
            recipe,
            hop: h.hop,
            amount: h.amount ?? null,
            boilTime: h.boilTime ?? null,
            stage: h.stage,
          });
          em.persist(rh);
        }
      }

      if (input.yeasts?.length) {
        for (const y of input.yeasts) {
          const ry = em.create(RecipeYeast, {
            recipe,
            yeast: y.yeast,
            amount: y.amount ?? null,
            pitchingRate: y.pitchingRate ?? null,
            stage: y.stage,
          });
          em.persist(ry);
        }
      }

      if (input.waters?.length) {
        for (const w of input.waters) {
          const rw = em.create(RecipeWater, {
            recipe,
            waterProfile: w.waterProfile,
            volume: w.volume ?? null,
            adjustments: w.adjustments ?? null,
          });
          em.persist(rw);
        }
      }

      if (input.mash) {
        const rm = em.create(RecipeMash, {
          recipe,
          mashProfile: input.mash.mashProfile,
          actualEfficiency: input.mash.actualEfficiency ?? null,
        });
        em.persist(rm);
      }

      if (input.fermentation) {
        const rf = em.create(RecipeFermentation, {
          recipe,
          fermentationProfile: input.fermentation.fermentationProfile,
          actualAttenuation: input.fermentation.actualAttenuation ?? null,
          finalAbv: input.fermentation.finalAbv ?? null,
          observations: input.fermentation.observations ?? null,
        });
        em.persist(rf);
      }

      if (input.carbonation) {
        const rc = em.create(RecipeCarbonation, {
          recipe,
          carbonationProfile: input.carbonation.carbonationProfile,
          amountUsed: input.carbonation.amountUsed ?? null,
          temperature: input.carbonation.temperature ?? null,
          co2Volumes: input.carbonation.co2Volumes ?? null,
        });
        em.persist(rc);
      }

      await em.flush();

      const created = await em.findOneOrFail(
        Recipe,
        { id: recipe.id },
        { populate: ['fermentables', 'hops', 'yeasts', 'waters'] },
      );

      return created;
    });
  }

  async updateRecipe(
    userId: string,
    recipeId: string,
    input: RecipeUpsertInput,
  ): Promise<Recipe> {
    return await this.em.transactional(async (em) => {
      const recipe = await em.findOne(Recipe, { id: recipeId, user: userId });
      if (!recipe) throw new NotFoundException('Recipe not found');

      if (input.recipe) {
        em.assign(recipe, input.recipe);
      }

      await em.nativeDelete(RecipeFermentable, { recipe: recipe.id });
      await em.nativeDelete(RecipeHop, { recipe: recipe.id });
      await em.nativeDelete(RecipeYeast, { recipe: recipe.id });
      await em.nativeDelete(RecipeWater, { recipe: recipe.id });
      await em.nativeDelete(RecipeMash, { recipe: recipe.id });
      await em.nativeDelete(RecipeFermentation, { recipe: recipe.id });
      await em.nativeDelete(RecipeCarbonation, { recipe: recipe.id });

      if (input.fermentables?.length) {
        for (const f of input.fermentables) {
          em.persist(
            em.create(RecipeFermentable, {
              recipe,
              fermentable: f.fermentable,
              amount: f.amount ?? null,
            }),
          );
        }
      }

      if (input.hops?.length) {
        for (const h of input.hops) {
          em.persist(
            em.create(RecipeHop, {
              recipe,
              hop: h.hop,
              amount: h.amount ?? null,
              boilTime: h.boilTime ?? null,
              stage: h.stage,
            }),
          );
        }
      }

      if (input.yeasts?.length) {
        for (const y of input.yeasts) {
          em.persist(
            em.create(RecipeYeast, {
              recipe,
              yeast: y.yeast,
              amount: y.amount ?? null,
              pitchingRate: y.pitchingRate ?? null,
              stage: y.stage,
            }),
          );
        }
      }

      if (input.waters?.length) {
        for (const w of input.waters) {
          em.persist(
            em.create(RecipeWater, {
              recipe,
              waterProfile: w.waterProfile,
              volume: w.volume ?? null,
              adjustments: w.adjustments ?? null,
            }),
          );
        }
      }

      if (input.mash) {
        em.persist(
          em.create(RecipeMash, {
            recipe,
            mashProfile: input.mash.mashProfile,
            actualEfficiency: input.mash.actualEfficiency ?? null,
          }),
        );
      }

      if (input.fermentation) {
        em.persist(
          em.create(RecipeFermentation, {
            recipe,
            fermentationProfile: input.fermentation.fermentationProfile,
            actualAttenuation: input.fermentation.actualAttenuation ?? null,
            finalAbv: input.fermentation.finalAbv ?? null,
            observations: input.fermentation.observations ?? null,
          }),
        );
      }

      if (input.carbonation) {
        em.persist(
          em.create(RecipeCarbonation, {
            recipe,
            carbonationProfile: input.carbonation.carbonationProfile,
            amountUsed: input.carbonation.amountUsed ?? null,
            temperature: input.carbonation.temperature ?? null,
            co2Volumes: input.carbonation.co2Volumes ?? null,
          }),
        );
      }

      await em.flush();

      const updated = await em.findOneOrFail(
        Recipe,
        { id: recipe.id },
        { populate: ['fermentables', 'hops', 'yeasts', 'waters'] },
      );
      return updated;
    });
  }

  async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    await this.em.transactional(async (em) => {
      const recipe = await em.findOne(Recipe, { id: recipeId, user: userId });
      if (!recipe) throw new NotFoundException('Recipe not found');

      await em.nativeDelete(RecipeFermentable, { recipe: recipe.id });
      await em.nativeDelete(RecipeHop, { recipe: recipe.id });
      await em.nativeDelete(RecipeYeast, { recipe: recipe.id });
      await em.nativeDelete(RecipeWater, { recipe: recipe.id });
      await em.nativeDelete(RecipeMash, { recipe: recipe.id });
      await em.nativeDelete(RecipeFermentation, { recipe: recipe.id });
      await em.nativeDelete(RecipeCarbonation, { recipe: recipe.id });

      await em.removeAndFlush(recipe);
    });
  }
}
