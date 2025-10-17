import { Injectable } from '@nestjs/common';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { FermentationProfile } from '../entities/fermentation-profile.entity';
import { EntityManager } from '@mikro-orm/core';
import { FermentationProfileInput } from '../inputs/fermentation-profile.input';
import { FermentationStep } from '../entities/fermentation-step.entity';

@Injectable()
export class FermentationProfileService extends BaseEntityService<FermentationProfile> {
  constructor(em: EntityManager) {
    super(em, FermentationProfile);
  }

  async findAll(): Promise<FermentationProfile[]> {
    return await this.em.find(
      FermentationProfile,
      {},
      { populate: ['steps'], orderBy: { createdAt: 'DESC' } },
    );
  }

  override async findById(id: string): Promise<FermentationProfile | null> {
    return await this.em.findOne(
      FermentationProfile,
      { id },
      { populate: ['steps'] },
    );
  }

  async findPublic(): Promise<FermentationProfile[]> {
    return await this.em.find(
      FermentationProfile,
      { isPublic: true },
      { populate: ['steps'], orderBy: { createdAt: 'DESC' } },
    );
  }

  async saveProfile(
    input: FermentationProfileInput,
  ): Promise<FermentationProfile> {
    const { steps: stepsInput, ...profileData } = input;

    const profile = await this.save(profileData);

    if (input.id) {
      const existingProfile = await this.em.findOneOrFail(
        FermentationProfile,
        input.id,
        { populate: ['steps'] },
      );
      existingProfile.steps.removeAll();
      await this.em.flush();
    }

    for (const stepInput of stepsInput) {
      const step = this.em.create(FermentationStep, {
        ...stepInput,
        fermentationProfile: profile,
      });
      profile.steps.add(step);
    }

    await this.em.flush();
    return profile;
  }

  calculateTotalFermentationDays(profile: FermentationProfile): number {
    return profile.steps
      .getItems()
      .reduce((sum, step) => sum + step.duration, 0);
  }

  calculateExpectedFG(originalGravity: number, attenuation: number): number {
    const gravityPoints = (originalGravity - 1) * 1000;
    const fermentedPoints = gravityPoints * (attenuation / 100);
    const finalGravityPoints = gravityPoints - fermentedPoints;
    return 1 + finalGravityPoints / 1000;
  }

  calculateResidualCO2(temperature: number): number {
    return (
      3.0378 - 0.050062 * temperature + 0.00026555 * temperature * temperature
    );
  }
}
