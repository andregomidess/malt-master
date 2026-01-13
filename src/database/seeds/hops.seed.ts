import type { EntityManager } from '@mikro-orm/postgresql';
import { Hop, HopForm, HopUse } from '../../catalog/entities/hop.entity';
import * as fs from 'fs';
import * as path from 'path';

interface HopData {
  name: string;
  alphaAcids: number;
  betaAcids: number;
  cohumulone?: number;
  totalOils?: number;
  form: string;
  uses: string[];
  aromaFlavor?: string;
  origin?: string;
  supplier?: string;
  hsi?: number;
  notes?: string;
}

// Função para mapear form do JSON para o enum HopForm
const mapFormToHopForm = (form: string): HopForm => {
  const formMap: Record<string, HopForm> = {
    pellet: HopForm.PELLET,
    leaf: HopForm.LEAF,
    cryo: HopForm.CRYO,
    extract: HopForm.EXTRACT,
  };

  return formMap[form.toLowerCase()] || HopForm.PELLET;
};

// Função para mapear uses do JSON para o enum HopUse[]
const mapUsesToHopUses = (uses: string[]): HopUse[] => {
  const useMap: Record<string, HopUse> = {
    bittering: HopUse.BITTERING,
    aroma: HopUse.AROMA,
    dry_hopping: HopUse.DRY_HOPPING,
    dual_purpose: HopUse.DUAL_PURPOSE,
  };

  return uses
    .map((use) => useMap[use.toLowerCase()])
    .filter((use): use is HopUse => use !== undefined);
};

export async function seedHops(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de lúpulos...');

  // Ler o arquivo JSON
  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/hops.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo hops.json não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const hopsData = JSON.parse(jsonData) as HopData[];

  console.log(`📖 Encontrados ${hopsData.length} lúpulos no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const hopData of hopsData) {
    try {
      // Verificar se o lúpulo já existe
      const existing = await em.findOne(Hop, { name: hopData.name });

      if (existing) {
        console.log(`⏭️  Pulando ${hopData.name} (já existe)`);
        skipped++;
        continue;
      }

      // Criar o lúpulo
      em.create(Hop, {
        name: hopData.name,
        alphaAcids: hopData.alphaAcids,
        betaAcids: hopData.betaAcids,
        cohumulone: hopData.cohumulone || null,
        totalOils: hopData.totalOils || null,
        form: mapFormToHopForm(hopData.form),
        uses: mapUsesToHopUses(hopData.uses),
        aromaFlavor: hopData.aromaFlavor || null,
        origin: hopData.origin || null,
        supplier: hopData.supplier || null,
        hsi: hopData.hsi || null,
        notes: hopData.notes || null,
        harvestYear: null,
        storageCondition: null,
        costPerKilogram: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user: null as any,
        createdAt: new Date(),
      });

      created++;
      console.log(`✅ Criado: ${hopData.name}`);
    } catch (error) {
      errors++;
      console.error(`❌ Erro ao criar ${hopData.name}:`, error);
    }
  }

  // Persistir todas as mudanças
  if (created > 0) {
    console.log('\n💾 Persistindo mudanças no banco de dados...');
    await em.flush();
  }

  console.log(`\n✨ Seed concluído!`);
  console.log(`   - Criados: ${created}`);
  console.log(`   - Pulados: ${skipped}`);
  console.log(`   - Erros: ${errors}`);
  console.log(`   - Total processado: ${hopsData.length}`);
}
