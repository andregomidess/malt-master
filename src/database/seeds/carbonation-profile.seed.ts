import type { EntityManager } from '@mikro-orm/postgresql';
import {
  CarbonationProfile,
  CarbonationType,
  PrimingSugarType,
} from '../../profiles/entities/carbonation-profile.entity';
import * as fs from 'fs';
import * as path from 'path';

interface CarbonationProfileData {
  name: string;
  user: null;
  type: string;
  targetCO2Volumes: number;
  servingTemperature: number;
  primingSugarType: string | null;
  primingSugarAmount: number | null;
  kegPressure: number | null;
  carbonationTime: number | null;
  carbonationMethod: string | null;
  observations: string | null;
  isPublic: boolean;
}

// Função para mapear type do JSON para o enum CarbonationType
const mapTypeToCarbonationType = (type: string): CarbonationType => {
  const typeMap: Record<string, CarbonationType> = {
    natural_priming: CarbonationType.NATURAL_PRIMING,
    forced_co2: CarbonationType.FORCED_CO2,
    bottle_conditioning: CarbonationType.BOTTLE_CONDITIONING,
  };

  return typeMap[type.toLowerCase()] || CarbonationType.BOTTLE_CONDITIONING;
};

// Função para mapear primingSugarType do JSON para o enum PrimingSugarType
const mapPrimingSugarType = (
  sugarType: string | null,
): PrimingSugarType | null => {
  if (!sugarType) return null;

  const sugarMap: Record<string, PrimingSugarType> = {
    table_sugar: PrimingSugarType.TABLE_SUGAR,
    corn_sugar: PrimingSugarType.CORN_SUGAR,
    dme: PrimingSugarType.DME,
    honey: PrimingSugarType.HONEY,
    maple_syrup: PrimingSugarType.MAPLE_SYRUP,
  };

  return sugarMap[sugarType.toLowerCase()] || null;
};

export async function seedCarbonationProfiles(
  em: EntityManager,
): Promise<void> {
  console.log('🌱 Iniciando seed de perfis de carbonatação...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/carbonation-profile.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const profilesData = JSON.parse(jsonData) as CarbonationProfileData[];

  console.log(`📖 Encontrados ${profilesData.length} perfis no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const profileData of profilesData) {
    try {
      const existing = await em.findOne(CarbonationProfile, {
        name: profileData.name,
      });

      if (existing) {
        console.log(`⏭️  Pulando ${profileData.name} (já existe)`);
        skipped++;
        continue;
      }

      em.create(CarbonationProfile, {
        name: profileData.name,
        user: null,
        type: mapTypeToCarbonationType(profileData.type),
        targetCO2Volumes: profileData.targetCO2Volumes,
        servingTemperature: profileData.servingTemperature,
        primingSugarType: mapPrimingSugarType(profileData.primingSugarType),
        primingSugarAmount: profileData.primingSugarAmount || null,
        kegPressure: profileData.kegPressure || null,
        carbonationTime: profileData.carbonationTime || null,
        carbonationMethod: profileData.carbonationMethod || null,
        observations: profileData.observations || null,
        isPublic: profileData.isPublic ?? false,
        createdAt: new Date(),
      });

      created++;
      console.log(`✅ Criado: ${profileData.name}`);
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
