import { Injectable } from '@nestjs/common';
import { Recipe } from '../entities/recipe.entity';
import { RecipeFermentable } from '../entities/recipe-fermentable.entity';
import { RecipeHop, HopStage } from '../entities/recipe-hop.entity';

const BREWING_CONSTANTS = {
  DEFAULT_EFFICIENCY: 70,

  DEFAULT_VOLUME: 20,

  DEFAULT_YIELD: 14,

  GRAVITY_POINTS_DIVISOR: 1000,

  SPECIFIC_GRAVITY_BASE: 1,

  TYPICAL_ATTENUATION_PERCENTAGE: 0.75,

  MAX_HOP_UTILIZATION: 0.25,

  POST_BOIL_HOP_UTILIZATION: 0.05,

  MAX_BOIL_TIME_MINUTES: 60,

  IBU_CONVERSION_FACTOR: 10,

  DEFAULT_COLOR_LOVIBOND: 2,

  ABV_CONVERSION_FACTOR: 131.25,
} as const;

type MaybeCollection<T> = T[] | { getItems(): T[] };

@Injectable()
export class RecipeCalculationsService {
  recalcAll(
    recipe: Recipe & {
      fermentables?: MaybeCollection<RecipeFermentable>;
      hops?: MaybeCollection<RecipeHop>;
    },
  ): void {
    const { og, fg } = this.calculateGravities(recipe);
    const ibu = this.calculateBitterness(recipe);
    const color = this.calculateColor(recipe);
    const abv = this.calculateAlcoholContent(og, fg);

    this.assignCalculatedValues(recipe, { og, fg, ibu, color, abv });
  }

  calculateGravities(
    recipe: Recipe & { fermentables?: MaybeCollection<RecipeFermentable> },
  ): GravityResult {
    const efficiency =
      recipe.plannedEfficiency ?? BREWING_CONSTANTS.DEFAULT_EFFICIENCY;
    const volume = recipe.plannedVolume ?? BREWING_CONSTANTS.DEFAULT_VOLUME;
    const fermentables = this.toArray(recipe.fermentables);

    const totalGravityPoints = this.calculateTotalGravityPoints(fermentables);
    const adjustedPoints = this.applyEfficiency(totalGravityPoints, efficiency);
    const ogPoints = this.normalizeByVolume(adjustedPoints, volume);

    const og = this.convertToSpecificGravity(ogPoints);
    const fg = this.estimateFinalGravity(og);

    return { og, fg };
  }

  calculateBitterness(
    recipe: Recipe & { hops?: MaybeCollection<RecipeHop> },
  ): number | null {
    const volume = recipe.plannedVolume ?? BREWING_CONSTANTS.DEFAULT_VOLUME;
    const hops = this.toArray(recipe.hops);

    const totalBitterness = hops.reduce((total, hop) => {
      const utilization = this.calculateHopUtilization(hop);
      const bitterness = this.calculateHopBitterness(hop, utilization);
      return total + bitterness;
    }, 0);

    return this.normalizeIbu(totalBitterness, volume);
  }

  calculateColor(
    recipe: Recipe & { fermentables?: MaybeCollection<RecipeFermentable> },
  ): number | null {
    const fermentables = this.toArray(recipe.fermentables);
    const volume = recipe.plannedVolume ?? BREWING_CONSTANTS.DEFAULT_VOLUME;

    const totalColorUnits = fermentables.reduce((total, recipeFermentable) => {
      const amount = recipeFermentable.amount ?? 0;
      const colorLovibond =
        recipeFermentable.fermentable?.color ??
        BREWING_CONSTANTS.DEFAULT_COLOR_LOVIBOND;
      return total + amount * colorLovibond;
    }, 0);

    const srm = totalColorUnits / volume;
    return this.roundToPrecision(srm, 1);
  }

  calculateAlcoholContent(og: number | null, fg: number | null): number | null {
    if (!this.isValidGravity(og) || !this.isValidGravity(fg)) {
      return null;
    }

    const abv = (og - fg) * BREWING_CONSTANTS.ABV_CONVERSION_FACTOR;
    return this.roundToPrecision(abv, 2);
  }

  private calculateTotalGravityPoints(
    fermentables: RecipeFermentable[],
  ): number {
    return fermentables.reduce((total, recipeFermentable) => {
      const amount = recipeFermentable.amount ?? 0;
      const yieldValue =
        recipeFermentable.fermentable?.yield ?? BREWING_CONSTANTS.DEFAULT_YIELD;
      return total + amount * yieldValue;
    }, 0);
  }

  private applyEfficiency(points: number, efficiency: number): number {
    return points * (efficiency / 100);
  }

  private normalizeByVolume(points: number, volume: number): number {
    return points / Math.max(volume, 1);
  }

  private convertToSpecificGravity(points: number): number | null {
    if (points === 0) return null;

    const sg =
      BREWING_CONSTANTS.SPECIFIC_GRAVITY_BASE +
      points / BREWING_CONSTANTS.GRAVITY_POINTS_DIVISOR;

    return this.roundToPrecision(sg, 3);
  }

  private estimateFinalGravity(og: number | null): number | null {
    if (!og) return null;

    // Fórmula correta: FG = 1 + ((OG - 1) × (1 - atenuação))
    // Exemplo: OG=1.050, atenuação=75% → FG = 1 + (0.050 × 0.25) = 1.0125
    const gravityPoints = og - BREWING_CONSTANTS.SPECIFIC_GRAVITY_BASE;
    const remainingPoints =
      gravityPoints * (1 - BREWING_CONSTANTS.TYPICAL_ATTENUATION_PERCENTAGE);
    const fg = BREWING_CONSTANTS.SPECIFIC_GRAVITY_BASE + remainingPoints;

    return this.roundToPrecision(fg, 3);
  }

  private calculateHopUtilization(hop: RecipeHop): number {
    if (hop.stage !== HopStage.BOIL) {
      return BREWING_CONSTANTS.POST_BOIL_HOP_UTILIZATION;
    }

    const boilTime = this.getBoilTime(hop);
    const utilizationRatio =
      Math.min(boilTime, BREWING_CONSTANTS.MAX_BOIL_TIME_MINUTES) /
      BREWING_CONSTANTS.MAX_BOIL_TIME_MINUTES;

    return utilizationRatio * BREWING_CONSTANTS.MAX_HOP_UTILIZATION;
  }

  private calculateHopBitterness(hop: RecipeHop, utilization: number): number {
    return (hop.amount ?? 0) * utilization;
  }

  private normalizeIbu(totalBitterness: number, volume: number): number | null {
    const ibu =
      (totalBitterness / Math.max(volume, 1)) *
      BREWING_CONSTANTS.IBU_CONVERSION_FACTOR;

    return this.roundToPrecision(ibu, 1);
  }

  private assignCalculatedValues(
    recipe: Recipe,
    values: {
      og: number | null;
      fg: number | null;
      ibu: number | null;
      color: number | null;
      abv: number | null;
    },
  ): void {
    recipe.originalGravity = values.og;
    recipe.finalGravity = values.fg;
    recipe.estimatedIbu = values.ibu;
    recipe.estimatedColor = values.color;
    recipe.estimatedAbv = values.abv;
  }

  private getBoilTime(hop: RecipeHop): number {
    return typeof hop.boilTime === 'number' ? hop.boilTime : 0;
  }

  private isValidGravity(
    gravity: number | null | undefined,
  ): gravity is number {
    return typeof gravity === 'number' && !isNaN(gravity) && gravity > 0;
  }

  private roundToPrecision(value: number, decimals: number): number {
    return +value.toFixed(decimals);
  }

  private toArray<T>(collection?: MaybeCollection<T>): T[] {
    if (!collection) return [];
    return Array.isArray(collection) ? collection : collection.getItems();
  }
}

type GravityResult = {
  og: number | null;
  fg: number | null;
};
