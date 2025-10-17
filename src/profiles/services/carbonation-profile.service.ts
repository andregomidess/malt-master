import { Injectable } from '@nestjs/common';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import {
  CarbonationProfile,
  PrimingSugarType,
} from '../entities/carbonation-profile.entity';
import { EntityManager } from '@mikro-orm/core';
import { CarbonationProfileInput } from '../inputs/carbonation-profile.input';

@Injectable()
export class CarbonationProfileService extends BaseEntityService<CarbonationProfile> {
  constructor(em: EntityManager) {
    super(em, CarbonationProfile);
  }

  async findAll(): Promise<CarbonationProfile[]> {
    return await this.em.find(
      CarbonationProfile,
      {},
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  override async findById(id: string): Promise<CarbonationProfile | null> {
    return await this.em.findOne(CarbonationProfile, { id });
  }

  async findPublic(): Promise<CarbonationProfile[]> {
    return await this.em.find(
      CarbonationProfile,
      { isPublic: true },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  async saveProfile(
    input: CarbonationProfileInput,
  ): Promise<CarbonationProfile> {
    return await this.save(input);
  }

  calculatePrimingSugar(
    volumeBeer: number,
    targetCO2: number,
    currentCO2: number,
    sugarType: PrimingSugarType,
  ): number {
    const co2Needed = targetCO2 - currentCO2;

    const sugarFactors: Record<PrimingSugarType, number> = {
      [PrimingSugarType.TABLE_SUGAR]: 1.0,
      [PrimingSugarType.CORN_SUGAR]: 0.91,
      [PrimingSugarType.DME]: 0.68,
      [PrimingSugarType.HONEY]: 0.95,
      [PrimingSugarType.MAPLE_SYRUP]: 0.9,
    };

    const baseAmountPerLiter = co2Needed * 4;
    const totalSugar =
      (baseAmountPerLiter * volumeBeer) / sugarFactors[sugarType];

    return Math.max(0, totalSugar);
  }

  calculateResidualCO2(temperature: number): number {
    return (
      3.0378 - 0.050062 * temperature + 0.00026555 * temperature * temperature
    );
  }

  calculateKegPressure(targetCO2: number, temperature: number): number {
    const tempFahrenheit = temperature * 1.8 + 32;

    const P =
      -16.6999 -
      0.0101059 * tempFahrenheit +
      0.00116512 * tempFahrenheit * tempFahrenheit +
      (0.173354 * tempFahrenheit + 4.24267) * targetCO2;

    return Math.max(0, P);
  }

  calculatePrimingSugarPerLiter(
    targetCO2: number,
    currentCO2: number,
    sugarType: PrimingSugarType,
  ): number {
    const co2Needed = targetCO2 - currentCO2;

    const sugarFactors: Record<PrimingSugarType, number> = {
      [PrimingSugarType.TABLE_SUGAR]: 1.0,
      [PrimingSugarType.CORN_SUGAR]: 0.91,
      [PrimingSugarType.DME]: 0.68,
      [PrimingSugarType.HONEY]: 0.95,
      [PrimingSugarType.MAPLE_SYRUP]: 0.9,
    };

    const baseAmount = co2Needed * 4;
    return baseAmount / sugarFactors[sugarType];
  }
}
