import type { EntityManager } from '@mikro-orm/postgresql';
import {
  Yeast,
  YeastType,
  YeastFlocculation,
  YeastFormat,
} from '../../catalog/entities/yeast.entity';
import * as fs from 'fs';
import * as path from 'path';

interface YeastData {
  name: string;
  supplier: string | null;
  type: string;
  attenuation: number | null;
  flocculation: string;
  minTemp: number | null;
  maxTemp: number | null;
  format: string;
  alcoholTolerance: number | null;
  origin: string | null;
  aromaFlavor: string | null;
  rehydrationNotes: string | null;
  starterNotes: string | null;
  notes: string | null;
}

const mapType = (type: string): YeastType => {
  const typeMap: Record<string, YeastType> = {
    ale: YeastType.ALE,
    lager: YeastType.LAGER,
    wild: YeastType.WILD,
    bacteria: YeastType.BACTERIA,
  };

  return typeMap[type.toLowerCase()] || YeastType.ALE;
};

const mapFlocculation = (flocculation: string): YeastFlocculation => {
  const flocMap: Record<string, YeastFlocculation> = {
    low: YeastFlocculation.LOW,
    medium: YeastFlocculation.MEDIUM,
    high: YeastFlocculation.HIGH,
  };

  return flocMap[flocculation.toLowerCase()] || YeastFlocculation.MEDIUM;
};

const mapFormat = (format: string): YeastFormat => {
  const formatMap: Record<string, YeastFormat> = {
    dry: YeastFormat.DRY,
    liquid: YeastFormat.LIQUID,
    slurry: YeastFormat.SLURRY,
  };

  return formatMap[format.toLowerCase()] || YeastFormat.DRY;
};

export async function seedYeast(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de leveduras...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/yeast.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const yeastData = JSON.parse(jsonData) as YeastData[];

  console.log(`📖 Encontradas ${yeastData.length} leveduras no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const yeast of yeastData) {
    try {
      // Verificar se já existe (usando name + supplier como unique constraint)
      const existing = await em.findOne(Yeast, {
        name: yeast.name,
        supplier: yeast.supplier || null,
      });

      if (existing) {
        console.log(`⏭️  Pulando ${yeast.name} (já existe)`);
        skipped++;
        continue;
      }

      em.create(Yeast, {
        name: yeast.name,
        supplier: yeast.supplier || null,
        type: mapType(yeast.type),
        attenuation: yeast.attenuation || null,
        flocculation: mapFlocculation(yeast.flocculation),
        minTemp: yeast.minTemp || null,
        maxTemp: yeast.maxTemp || null,
        format: mapFormat(yeast.format),
        alcoholTolerance: yeast.alcoholTolerance || null,
        origin: yeast.origin || null,
        aromaFlavor: yeast.aromaFlavor || null,
        rehydrationNotes: yeast.rehydrationNotes || null,
        starterNotes: yeast.starterNotes || null,
        notes: yeast.notes || null,
        packagingDate: null, // Não disponível no JSON
        user: null,
        createdAt: new Date(),
      });

      created++;
      console.log(`✅ Criado: ${yeast.name}`);
    } catch (error) {
      errors++;
      console.error(`❌ Erro ao criar ${yeast.name}:`, error);
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
  console.log(`   - Total processado: ${yeastData.length}`);
}

