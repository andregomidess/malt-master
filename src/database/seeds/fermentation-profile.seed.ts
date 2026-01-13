import type { EntityManager } from '@mikro-orm/postgresql';
import {
  FermentationProfile,
  FermentationProfileType,
} from '../../profiles/entities/fermentation-profile.entity';
import { FermentationStep } from '../../profiles/entities/fermentation-step.entity';
import * as fs from 'fs';
import * as path from 'path';

interface FermentationStepData {
  stepOrder: number;
  name: string;
  temperature: number;
  duration: number;
  targetGravity: number | null;
  pressureControl: number | null;
  isRamping: boolean;
  rampTime: number | null;
  rampToTemperature: number | null;
  description: string | null;
}

interface FermentationProfileData {
  name: string;
  user: null;
  type: string;
  yeastStrain: string | null;
  targetFinalGravity: number | null;
  estimatedAttenuation: number | null;
  isMultiStage: boolean;
  observations: string | null;
  isPublic: boolean;
  steps: FermentationStepData[];
}

const mapType = (type: string): FermentationProfileType => {
  const typeMap: Record<string, FermentationProfileType> = {
    primary: FermentationProfileType.PRIMARY,
    secondary: FermentationProfileType.SECONDARY,
    lagering: FermentationProfileType.LAGERING,
    conditioning: FermentationProfileType.CONDITIONING,
    bottle_conditioning: FermentationProfileType.BOTTLE_CONDITIONING,
    keg_conditioning: FermentationProfileType.KEG_CONDITIONING,
  };

  return typeMap[type.toLowerCase()] || FermentationProfileType.PRIMARY;
};

export async function seedFermentationProfiles(
  em: EntityManager,
): Promise<void> {
  console.log('🌱 Iniciando seed de perfis de fermentação...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/fermentation-profile.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const profilesData = JSON.parse(jsonData) as FermentationProfileData[];

  console.log(`📖 Encontrados ${profilesData.length} perfis no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const profileData of profilesData) {
    try {
      const existing = await em.findOne(FermentationProfile, {
        name: profileData.name,
      });

      if (existing) {
        console.log(`⏭️  Pulando ${profileData.name} (já existe)`);
        skipped++;
        continue;
      }

      const profile = em.create(FermentationProfile, {
        name: profileData.name,
        user: null,
        type: mapType(profileData.type),
        yeastStrain: profileData.yeastStrain || null,
        targetFinalGravity: profileData.targetFinalGravity || null,
        estimatedAttenuation: profileData.estimatedAttenuation || null,
        isMultiStage: profileData.isMultiStage ?? false,
        observations: profileData.observations || null,
        isPublic: profileData.isPublic ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Criar os steps
      for (const stepData of profileData.steps) {
        em.create(FermentationStep, {
          fermentationProfile: profile,
          stepOrder: stepData.stepOrder,
          name: stepData.name,
          temperature: stepData.temperature,
          duration: stepData.duration,
          targetGravity: stepData.targetGravity || null,
          pressureControl: stepData.pressureControl || null,
          isRamping: stepData.isRamping ?? false,
          rampTime: stepData.rampTime || null,
          rampToTemperature: stepData.rampToTemperature || null,
          description: stepData.description || null,
        });
      }

      created++;
      console.log(
        `✅ Criado: ${profileData.name} (${profileData.steps.length} steps)`,
      );
    } catch (error) {
      errors++;
      console.error(`❌ Erro ao criar ${profileData.name}:`, error);
    }
  }

  if (created > 0) {
    console.log('\n💾 Persistindo mudanças no banco de dados...');
    await em.flush();
  }

  console.log(`\n✨ Seed concluído!`);
  console.log(`   - Criados: ${created}`);
  console.log(`   - Pulados: ${skipped}`);
  console.log(`   - Erros: ${errors}`);
  console.log(`   - Total processado: ${profilesData.length}`);
}
