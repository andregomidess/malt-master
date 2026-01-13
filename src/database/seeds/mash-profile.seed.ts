import type { EntityManager } from '@mikro-orm/postgresql';
import {
  MashProfile,
  MashProfileType,
} from '../../profiles/entities/mash-profile.entity';
import {
  MashStep,
  MashStepType,
} from '../../profiles/entities/mash-step.entity';
import * as fs from 'fs';
import * as path from 'path';

interface MashStepData {
  stepOrder: number;
  name: string;
  stepType: string;
  temperature: number;
  duration: number;
  infusionAmount: number | null;
  infusionTemp: number | null;
  decoctionAmount: number | null;
  rampTime: number | null;
  description: string | null;
}

interface MashProfileData {
  name: string;
  user: null;
  type: string;
  estimatedEfficiency: number | null;
  grainTemperature: number;
  tunTemperature: number;
  spargeTemperature: number;
  tunWeight: number | null;
  tunSpecificHeat: number;
  mashThickness: number;
  observations: string | null;
  isPublic: boolean;
  steps: MashStepData[];
}

const mapType = (type: string): MashProfileType => {
  const typeMap: Record<string, MashProfileType> = {
    infusion: MashProfileType.INFUSION,
    decoction: MashProfileType.DECOCTION,
    step_mash: MashProfileType.STEP_MASH,
    biab: MashProfileType.BIAB,
  };

  return typeMap[type.toLowerCase()] || MashProfileType.INFUSION;
};

const mapStepType = (stepType: string): MashStepType => {
  const stepTypeMap: Record<string, MashStepType> = {
    infusion: MashStepType.INFUSION,
    temperature: MashStepType.TEMPERATURE,
    decoction: MashStepType.DECOCTION,
  };

  return stepTypeMap[stepType.toLowerCase()] || MashStepType.TEMPERATURE;
};

export async function seedMashProfiles(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de perfis de mostura...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/mash-profile.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const profilesData = JSON.parse(jsonData) as MashProfileData[];

  console.log(`📖 Encontrados ${profilesData.length} perfis no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const profileData of profilesData) {
    try {
      const existing = await em.findOne(MashProfile, {
        name: profileData.name,
      });

      if (existing) {
        console.log(`⏭️  Pulando ${profileData.name} (já existe)`);
        skipped++;
        continue;
      }

      const profile = em.create(MashProfile, {
        name: profileData.name,
        user: null,
        type: mapType(profileData.type),
        estimatedEfficiency: profileData.estimatedEfficiency || null,
        grainTemperature: profileData.grainTemperature || 20,
        tunTemperature: profileData.tunTemperature || 20,
        spargeTemperature: profileData.spargeTemperature || 78,
        tunWeight: profileData.tunWeight || null,
        tunSpecificHeat: profileData.tunSpecificHeat || 0.3,
        mashThickness: profileData.mashThickness || 3.0,
        observations: profileData.observations || null,
        isPublic: profileData.isPublic ?? false,
        createdAt: new Date(),
      });

      // Criar os steps
      for (const stepData of profileData.steps) {
        em.create(MashStep, {
          mashProfile: profile,
          stepOrder: stepData.stepOrder,
          name: stepData.name,
          stepType: mapStepType(stepData.stepType),
          temperature: stepData.temperature,
          duration: stepData.duration,
          infusionAmount: stepData.infusionAmount || null,
          infusionTemp: stepData.infusionTemp || null,
          decoctionAmount: stepData.decoctionAmount || null,
          rampTime: stepData.rampTime || null,
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
