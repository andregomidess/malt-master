import { Injectable } from '@nestjs/common';
import { Recipe } from '../entities/recipe.entity';
import { RecipeFermentable } from '../entities/recipe-fermentable.entity';
import { RecipeHop, HopStage } from '../entities/recipe-hop.entity';
import { BREWING_CONSTANTS } from '../helpers/recipe.constants';

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
    const ibu = this.calculateBitterness(recipe, og);
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
    originalGravity: number | null,
  ): number | null {
    const volume = recipe.plannedVolume ?? BREWING_CONSTANTS.DEFAULT_VOLUME;
    const hops = this.toArray(recipe.hops);

    const totalAlphaAcidMass = hops.reduce((total, hop) => {
      const utilization = this.calculateHopUtilization(hop, originalGravity);
      const alphaAcidContribution = this.calculateHopBitterness(
        hop,
        utilization,
      );
      return total + alphaAcidContribution;
    }, 0);

    return this.normalizeIbu(totalAlphaAcidMass, volume);
  }

  calculateColor(
    recipe: Recipe & { fermentables?: MaybeCollection<RecipeFermentable> },
  ): number | null {
    const fermentables = this.toArray(recipe.fermentables);
    const volumeLiters =
      recipe.plannedVolume ?? BREWING_CONSTANTS.DEFAULT_VOLUME;

    const volumeGallons =
      volumeLiters * BREWING_CONSTANTS.COLOR_CONVERSIONS.LITERS_TO_GALLONS;

    const mcu = fermentables.reduce((total, recipeFermentable) => {
      const amountKg = recipeFermentable.amount ?? 0;
      const colorLovibond =
        recipeFermentable.fermentable?.color ??
        BREWING_CONSTANTS.DEFAULT_COLOR_LOVIBOND;

      const amountLbs =
        amountKg * BREWING_CONSTANTS.COLOR_CONVERSIONS.KG_TO_LBS;

      return total + (amountLbs * colorLovibond) / volumeGallons;
    }, 0);

    const srm = this.calculateMoreySRM(mcu);

    return this.roundToPrecision(srm, 1);
  }

  calculateAlcoholContent(og: number | null, fg: number | null): number | null {
    if (!this.isValidGravity(og) || !this.isValidGravity(fg)) return null;

    const abv = (og - fg) * BREWING_CONSTANTS.ABV_CONVERSION_FACTOR;
    return this.roundToPrecision(abv, 2);
  }

  private calculateTotalGravityPoints(
    fermentables: RecipeFermentable[],
  ): number {
    return fermentables.reduce((total, recipeFermentable) => {
      const amount = recipeFermentable.amount ?? 0;
      const yieldPPG =
        recipeFermentable.fermentable?.yield ?? BREWING_CONSTANTS.DEFAULT_YIELD;

      const gravityPoints =
        amount * yieldPPG * BREWING_CONSTANTS.PPG_TO_METRIC_CONVERSION;

      return total + gravityPoints;
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

    const gravityPoints = og - BREWING_CONSTANTS.SPECIFIC_GRAVITY_BASE;
    const remainingPoints =
      gravityPoints * (1 - BREWING_CONSTANTS.TYPICAL_ATTENUATION_PERCENTAGE);
    const fg = BREWING_CONSTANTS.SPECIFIC_GRAVITY_BASE + remainingPoints;

    return this.roundToPrecision(fg, 3);
  }

  private calculateHopUtilization(
    hop: RecipeHop,
    originalGravity: number | null,
  ): number {
    if (hop.stage !== HopStage.BOIL)
      return BREWING_CONSTANTS.POST_BOIL_HOP_UTILIZATION;

    const boilTime = this.getBoilTime(hop);
    const og = originalGravity ?? BREWING_CONSTANTS.SPECIFIC_GRAVITY_BASE;

    const gravityFactor = this.calculateTinsethGravityFactor(og);
    const timeFactor = this.calculateTinsethTimeFactor(boilTime);

    return gravityFactor * timeFactor;
  }

  private calculateTinsethGravityFactor(og: number): number {
    const { GRAVITY_COEFFICIENT, GRAVITY_BASE } = BREWING_CONSTANTS.TINSETH;
    const gravityPoints = og - BREWING_CONSTANTS.SPECIFIC_GRAVITY_BASE;

    return GRAVITY_COEFFICIENT * Math.pow(GRAVITY_BASE, gravityPoints);
  }

  private calculateTinsethTimeFactor(boilTimeMinutes: number): number {
    const { TIME_COEFFICIENT, TIME_DIVISOR } = BREWING_CONSTANTS.TINSETH;
    const exponentialDecay = 1 - Math.exp(-TIME_COEFFICIENT * boilTimeMinutes);

    return exponentialDecay / TIME_DIVISOR;
  }

  private calculateMoreySRM(mcu: number): number {
    const { COEFFICIENT, EXPONENT } = BREWING_CONSTANTS.MOREY;

    return COEFFICIENT * Math.pow(mcu, EXPONENT);
  }

  private calculateHopBitterness(hop: RecipeHop, utilization: number): number {
    const hopAmount = hop.amount ?? 0;
    const alphaAcidPercentage =
      hop.hop?.alphaAcids ?? BREWING_CONSTANTS.DEFAULT_ALPHA_ACIDS;

    const alphaAcidMass = hopAmount * (alphaAcidPercentage / 100);

    return alphaAcidMass * utilization;
  }

  private normalizeIbu(
    totalAlphaAcidMass: number,
    volume: number,
  ): number | null {
    const ibu =
      (totalAlphaAcidMass / Math.max(volume, 1)) *
      BREWING_CONSTANTS.IBU_METRIC_CONVERSION_FACTOR;

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
