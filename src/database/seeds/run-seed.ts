import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../config/mikro-orm.config';
import { seedBeerStyles } from './beer-styles.seed';
import { seedHops } from './hops.seed';
import { seedCarbonationProfiles } from './carbonation-profile.seed';
import { seedEquipment } from './equipment.seed';
import { seedFermentables } from './fermentables.seed';
import { seedFermentationProfiles } from './fermentation-profile.seed';
import { seedMashProfiles } from './mash-profile.seed';
import { seedWaterProfiles } from './water-profile.seed';
import { seedYeast } from './yeast.seed';

async function runSeed() {
  const seedType = process.argv[2] || 'all';

  console.log('🚀 Iniciando seed...\n');

  let orm: MikroORM | undefined;
  try {
    orm = await MikroORM.init(mikroOrmConfig);
    const em = orm.em.fork();

    if (seedType === 'beer-styles' || seedType === 'all') {
      console.log('📦 Seed de estilos de cerveja...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedBeerStyles(em as any);
    }

    if (seedType === 'hops' || seedType === 'all') {
      console.log('\n📦 Seed de lúpulos...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedHops(em as any);
    }

    if (seedType === 'carbonation-profiles' || seedType === 'all') {
      console.log('\n📦 Seed de perfis de carbonatação...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedCarbonationProfiles(em as any);
    }

    if (seedType === 'equipment' || seedType === 'all') {
      console.log('\n📦 Seed de equipamentos...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedEquipment(em as any);
    }

    if (seedType === 'fermentables' || seedType === 'all') {
      console.log('\n📦 Seed de fermentáveis...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedFermentables(em as any);
    }

    if (seedType === 'fermentation-profiles' || seedType === 'all') {
      console.log('\n📦 Seed de perfis de fermentação...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedFermentationProfiles(em as any);
    }

    if (seedType === 'mash-profiles' || seedType === 'all') {
      console.log('\n📦 Seed de perfis de mostura...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedMashProfiles(em as any);
    }

    if (seedType === 'water-profiles' || seedType === 'all') {
      console.log('\n📦 Seed de perfis de água...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedWaterProfiles(em as any);
    }

    if (seedType === 'yeast' || seedType === 'all') {
      console.log('\n📦 Seed de leveduras...\n');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await seedYeast(em as any);
    }

    console.log('\n✅ Seed executado com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    if (orm) {
      await orm.close();
    }
  }
}

void runSeed();
