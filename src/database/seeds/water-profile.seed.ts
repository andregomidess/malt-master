import type { EntityManager } from '@mikro-orm/postgresql';
import { WaterProfile } from '../../catalog/entities/water-profile.entity';
import * as fs from 'fs';
import * as path from 'path';

interface WaterProfileData {
  name: string;
  origin: string | null;
  ca: number;
  mg: number;
  na: number;
  so4: number;
  cl: number;
  hco3: number;
  ph: number | null;
  recommendedStyle: string | null;
  notes: string | null;
}

export async function seedWaterProfiles(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de perfis de água...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/water-profile.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const profilesData = JSON.parse(jsonData) as WaterProfileData[];

  console.log(`📖 Encontrados ${profilesData.length} perfis no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const profileData of profilesData) {
    try {
      const existing = await em.findOne(WaterProfile, {
        name: profileData.name,
      });

      if (existing) {
        console.log(`⏭️  Pulando ${profileData.name} (já existe)`);
        skipped++;
        continue;
      }

      em.create(WaterProfile, {
        name: profileData.name,
        user: null,
        origin: profileData.origin || null,
        ca: profileData.ca,
        mg: profileData.mg,
        na: profileData.na,
        so4: profileData.so4,
        cl: profileData.cl,
        hco3: profileData.hco3,
        ph: profileData.ph || null,
        recommendedStyle: profileData.recommendedStyle || null,
        notes: profileData.notes || null,
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

