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
    let profile: CarbonationProfile;

    if (input.id) {
      profile = await this.em.findOneOrFail(CarbonationProfile, input.id);

      // Atualiza os campos
      profile.name = input.name;
      profile.type = input.type;
      profile.targetCO2Volumes = input.targetCO2Volumes;
      profile.servingTemperature = input.servingTemperature;
      profile.primingSugarType = input.primingSugarType ?? null;
      profile.primingSugarAmount = input.primingSugarAmount ?? null;
      profile.kegPressure = input.kegPressure ?? null;
      profile.carbonationTime = input.carbonationTime ?? null;
      profile.carbonationMethod = input.carbonationMethod ?? null;
      profile.observations = input.observations ?? null;
      profile.isPublic = input.isPublic;
    } else {
      // Cria novo profile
      profile = this.em.create(CarbonationProfile, {
        name: input.name,
        type: input.type,
        targetCO2Volumes: input.targetCO2Volumes,
        servingTemperature: input.servingTemperature,
        primingSugarType: input.primingSugarType ?? null,
        primingSugarAmount: input.primingSugarAmount ?? null,
        kegPressure: input.kegPressure ?? null,
        carbonationTime: input.carbonationTime ?? null,
        carbonationMethod: input.carbonationMethod ?? null,
        observations: input.observations ?? null,
        isPublic: input.isPublic,
      });
    }

    await this.em.persistAndFlush(profile);
    return profile;
  }

  /**
   * Calcula a quantidade de açúcar para priming
   * @param volumeBeer Volume de cerveja em litros
   * @param targetCO2 Volumes de CO2 alvo
   * @param currentCO2 CO2 residual (baseado na temperatura)
   * @param sugarType Tipo de açúcar
   * @returns Quantidade total de açúcar em gramas
   */
  calculatePrimingSugar(
    volumeBeer: number,
    targetCO2: number,
    currentCO2: number,
    sugarType: PrimingSugarType,
  ): number {
    const co2Needed = targetCO2 - currentCO2;

    // Fatores de conversão (açúcar de mesa como base: 1.00)
    const sugarFactors: Record<PrimingSugarType, number> = {
      [PrimingSugarType.TABLE_SUGAR]: 1.0,
      [PrimingSugarType.CORN_SUGAR]: 0.91,
      [PrimingSugarType.DME]: 0.68,
      [PrimingSugarType.HONEY]: 0.95,
      [PrimingSugarType.MAPLE_SYRUP]: 0.9,
    };

    // Açúcar de mesa (sacarose) como base: 4g/L = 1 volume CO2
    const baseAmountPerLiter = co2Needed * 4;
    const totalSugar =
      (baseAmountPerLiter * volumeBeer) / sugarFactors[sugarType];

    return Math.max(0, totalSugar);
  }

  /**
   * Calcula CO2 residual baseado na temperatura
   * @param temperature Temperatura em °C
   * @returns Volumes de CO2 residual
   */
  calculateResidualCO2(temperature: number): number {
    // Fórmula empírica para CO2 residual após fermentação
    return (
      3.0378 - 0.050062 * temperature + 0.00026555 * temperature * temperature
    );
  }

  /**
   * Calcula a pressão necessária para carbonatação forçada
   * @param targetCO2 Volumes de CO2 alvo
   * @param temperature Temperatura em °C
   * @returns Pressão em PSI
   */
  calculateKegPressure(targetCO2: number, temperature: number): number {
    // Fórmula de Henry para solubilidade de CO2
    // P = -16.6999 - 0.0101059T + 0.00116512T² + (0.173354T + 4.24267)V
    const P =
      -16.6999 -
      0.0101059 * temperature +
      0.00116512 * temperature * temperature +
      (0.173354 * temperature + 4.24267) * targetCO2;

    return Math.max(0, P);
  }

  /**
   * Calcula a quantidade de açúcar por litro para priming
   * @param targetCO2 Volumes de CO2 alvo
   * @param currentCO2 CO2 residual
   * @param sugarType Tipo de açúcar
   * @returns Quantidade de açúcar em g/L
   */
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

    const baseAmount = co2Needed * 4; // g/L
    return baseAmount / sugarFactors[sugarType];
  }
}
