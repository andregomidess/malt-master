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
    const { steps: stepsInput, ...profileData } = input;

    const profile = await this.save(profileData);

    if (input.id) {
      const existingProfile = await this.em.findOneOrFail(
        MashProfile,
        input.id,
        {
          populate: ['steps'],
        },
      );
      existingProfile.steps.removeAll();
      await this.em.flush();
    }

    for (const stepInput of stepsInput) {
      const step = this.em.create(MashStep, {
        ...stepInput,
        mashProfile: profile,
      });
      profile.steps.add(step);
    }

    await this.em.flush();
    return profile;
  }

  calculateInfusionVolume(
    currentTemp: number,
    targetTemp: number,
    grainWeight: number,
    tunWeight: number,
    tunSpecificHeat: number,
    waterTemp: number = 100,
  ): number {
    const grainHeatCapacity = 0.4;
    const waterHeatCapacity = 1.0;

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
