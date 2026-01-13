import type { EntityManager } from '@mikro-orm/postgresql';
import {
  Fermentable,
  FermentableType,
  FermentableForm,
} from '../../catalog/entities/fermentable.entity';
import * as fs from 'fs';
import * as path from 'path';

interface FermentableData {
  name: string;
  type: string;
  form: string;
  yield: number | null;
  color: number | null;
  origin: string | null;
  supplier: string | null;
  notes: string | null;
}

const mapType = (type: string): FermentableType => {
  const typeMap: Record<string, FermentableType> = {
    base: FermentableType.BASE,
    specialty: FermentableType.SPECIALTY,
    sugar: FermentableType.SUGAR,
    adjunct: FermentableType.ADJUNCT,
  };

  return typeMap[type.toLowerCase()] || FermentableType.BASE;
};

const mapForm = (form: string): FermentableForm => {
  const formMap: Record<string, FermentableForm> = {
    grain: FermentableForm.GRAIN,
    dry_extract: FermentableForm.DRY_EXTRACT,
    liquid_extract: FermentableForm.LIQUID_EXTRACT,
    syrup: FermentableForm.SYRUP,
  };

  return formMap[form.toLowerCase()] || FermentableForm.GRAIN;
};

export async function seedFermentables(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de fermentáveis...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/fermentables.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const fermentablesData = JSON.parse(jsonData) as FermentableData[];

  console.log(
    `📖 Encontrados ${fermentablesData.length} fermentáveis no arquivo JSON`,
  );

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const fermentableData of fermentablesData) {
    try {
      const existing = await em.findOne(Fermentable, {
        name: fermentableData.name,
      });

      if (existing) {
        console.log(`⏭️  Pulando ${fermentableData.name} (já existe)`);
        skipped++;
        continue;
      }

      em.create(Fermentable, {
        name: fermentableData.name,
        type: mapType(fermentableData.type),
        form: mapForm(fermentableData.form),
        yield: fermentableData.yield || null,
        color: fermentableData.color || null,
        origin: fermentableData.origin || null,
        supplier: fermentableData.supplier || null,
        notes: fermentableData.notes || null,
        user: null,
        createdAt: new Date(),
      });

      created++;
      console.log(`✅ Criado: ${fermentableData.name}`);
    } catch (error) {
      errors++;
      console.error(`❌ Erro ao criar ${fermentableData.name}:`, error);
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
  console.log(`   - Total processado: ${fermentablesData.length}`);
}
