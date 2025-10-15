import { Injectable } from '@nestjs/common';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { MashProfile } from '../entities/mash-profile.entity';
import { EntityManager } from '@mikro-orm/core';
import { MashProfileInput } from '../inputs/mash-profile.input';
import { MashStep } from '../entities/mash-step.entity';

@Injectable()
export class MashProfileService extends BaseEntityService<MashProfile> {
  constructor(em: EntityManager) {
    super(em, MashProfile);
  }

  async findAll(): Promise<MashProfile[]> {
    return await this.em.find(
      MashProfile,
      {},
      { populate: ['steps'], orderBy: { createdAt: 'DESC' } },
    );
  }

  override async findById(id: string): Promise<MashProfile | null> {
    return await this.em.findOne(MashProfile, { id }, { populate: ['steps'] });
  }

  async findPublic(): Promise<MashProfile[]> {
    return await this.em.find(
      MashProfile,
      { isPublic: true },
      { populate: ['steps'], orderBy: { createdAt: 'DESC' } },
    );
  }

  async saveProfile(input: MashProfileInput): Promise<MashProfile> {
    let profile: MashProfile;

    if (input.id) {
      profile = await this.em.findOneOrFail(MashProfile, input.id, {
        populate: ['steps'],
      });

      // Atualiza os campos principais
      profile.name = input.name;
      profile.type = input.type;
      profile.estimatedEfficiency = input.estimatedEfficiency ?? null;
      profile.grainTemperature = input.grainTemperature;
      profile.tunTemperature = input.tunTemperature;
      profile.spargeTemperature = input.spargeTemperature;
      profile.tunWeight = input.tunWeight ?? null;
      profile.tunSpecificHeat = input.tunSpecificHeat;
      profile.mashThickness = input.mashThickness;
      profile.observations = input.observations ?? null;
      profile.isPublic = input.isPublic;

      // Remove steps antigos e adiciona novos
      profile.steps.removeAll();
      await this.em.flush();

      // Adiciona novos steps
      for (const stepInput of input.steps) {
        const step = this.em.create(MashStep, {
          ...stepInput,
          mashProfile: profile,
        });
        profile.steps.add(step);
      }
    } else {
      // Cria novo profile
      profile = this.em.create(MashProfile, {
        name: input.name,
        type: input.type,
        estimatedEfficiency: input.estimatedEfficiency ?? null,
        grainTemperature: input.grainTemperature,
        tunTemperature: input.tunTemperature,
        spargeTemperature: input.spargeTemperature,
        tunWeight: input.tunWeight ?? null,
        tunSpecificHeat: input.tunSpecificHeat,
        mashThickness: input.mashThickness,
        observations: input.observations ?? null,
        isPublic: input.isPublic,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Adiciona steps
      for (const stepInput of input.steps) {
        const step = this.em.create(MashStep, {
          ...stepInput,
          mashProfile: profile,
        });
        profile.steps.add(step);
      }
    }

    await this.em.persistAndFlush(profile);
    return profile;
  }

  /**
   * Calcula o volume de água necessário para uma infusão
   */
  calculateInfusionVolume(
    currentTemp: number,
    targetTemp: number,
    grainWeight: number,
    tunWeight: number,
    tunSpecificHeat: number,
    waterTemp: number = 100,
  ): number {
    const grainHeatCapacity = 0.4; // cal/g·°C
    const waterHeatCapacity = 1.0; // cal/g·°C

    const heatNeeded =
      (targetTemp - currentTemp) *
      (grainWeight * grainHeatCapacity + tunWeight * tunSpecificHeat);

    const waterVolume =
      heatNeeded / ((waterTemp - targetTemp) * waterHeatCapacity);

    return Math.max(0, waterVolume);
  }

  /**
   * Calcula a temperatura de strike water
   */
  calculateStrikeTemp(
    grainTemp: number,
    targetTemp: number,
    mashThickness: number,
  ): number {
    const grainHeatCapacity = 0.4;
    const waterHeatCapacity = 1.0;

    const strikeTemp =
      ((grainHeatCapacity / waterHeatCapacity) * (targetTemp - grainTemp)) /
        mashThickness +
      targetTemp;

    return strikeTemp;
  }
}
