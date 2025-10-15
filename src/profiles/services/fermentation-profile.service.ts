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
    let profile: FermentationProfile;

    if (input.id) {
      profile = await this.em.findOneOrFail(FermentationProfile, input.id, {
        populate: ['steps'],
      });

      // Atualiza os campos principais
      profile.name = input.name;
      profile.type = input.type;
      profile.yeastStrain = input.yeastStrain ?? null;
      profile.targetFinalGravity = input.targetFinalGravity ?? null;
      profile.estimatedAttenuation = input.estimatedAttenuation ?? null;
      profile.isMultiStage = input.isMultiStage;
      profile.observations = input.observations ?? null;
      profile.isPublic = input.isPublic;

      // Remove steps antigos e adiciona novos
      profile.steps.removeAll();
      await this.em.flush();

      // Adiciona novos steps
      for (const stepInput of input.steps) {
        const step = this.em.create(FermentationStep, {
          ...stepInput,
          fermentationProfile: profile,
        });
        profile.steps.add(step);
      }
    } else {
      // Cria novo profile
      profile = this.em.create(FermentationProfile, {
        name: input.name,
        type: input.type,
        yeastStrain: input.yeastStrain ?? null,
        targetFinalGravity: input.targetFinalGravity ?? null,
        estimatedAttenuation: input.estimatedAttenuation ?? null,
        isMultiStage: input.isMultiStage,
        observations: input.observations ?? null,
        isPublic: input.isPublic,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Adiciona steps
      for (const stepInput of input.steps) {
        const step = this.em.create(FermentationStep, {
          ...stepInput,
          fermentationProfile: profile,
        });
        profile.steps.add(step);
      }
    }

    await this.em.persistAndFlush(profile);
    return profile;
  }

  /**
   * Calcula o tempo total de fermentação (soma de todas as etapas)
   */
  calculateTotalFermentationDays(profile: FermentationProfile): number {
    return profile.steps
      .getItems()
      .reduce((sum, step) => sum + step.duration, 0);
  }

  /**
   * Calcula a densidade final esperada com base na OG e atenuação
   */
  calculateExpectedFG(originalGravity: number, attenuation: number): number {
    const gravityPoints = (originalGravity - 1) * 1000;
    const fermentedPoints = gravityPoints * (attenuation / 100);
    const finalGravityPoints = gravityPoints - fermentedPoints;
    return 1 + finalGravityPoints / 1000;
  }

  /**
   * Calcula CO2 residual baseado na temperatura de fermentação
   */
  calculateResidualCO2(temperature: number): number {
    // Fórmula empírica para CO2 residual após fermentação
    return (
      3.0378 - 0.050062 * temperature + 0.00026555 * temperature * temperature
    );
  }
}
