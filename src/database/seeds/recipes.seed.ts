import type { EntityManager } from '@mikro-orm/postgresql';
import { BeerStyle } from '../../catalog/entities/beer-style.entity';
import { Equipment } from '../../catalog/entities/equipment.entity';
import { Fermentable } from '../../catalog/entities/fermentable.entity';
import { Hop } from '../../catalog/entities/hop.entity';
import { WaterProfile } from '../../catalog/entities/water-profile.entity';
import { Yeast } from '../../catalog/entities/yeast.entity';
import { CarbonationProfile } from '../../profiles/entities/carbonation-profile.entity';
import { FermentationProfile } from '../../profiles/entities/fermentation-profile.entity';
import { MashProfile } from '../../profiles/entities/mash-profile.entity';
import { Recipe, RecipeType } from '../../recipes/entities/recipe.entity';
import {
  FermentableUsageType,
  RecipeFermentable,
} from '../../recipes/entities/recipe-fermentable.entity';
import { HopStage, RecipeHop } from '../../recipes/entities/recipe-hop.entity';
import {
  RecipeYeast,
  YeastStage,
} from '../../recipes/entities/recipe-yeast.entity';
import { RecipeWater } from '../../recipes/entities/recipe-water.entity';
import { RecipeMash } from '../../recipes/entities/recipe-mash.entity';
import { RecipeFermentation } from '../../recipes/entities/recipe-fermentation.entity';
import { RecipeCarbonation } from '../../recipes/entities/recipe-carbonation.entity';
import * as fs from 'fs';
import * as path from 'path';

interface RecipeFermentableSeed {
  fermentableName: string;
  amount: number | null;
  usageType?: string | null;
}

interface RecipeHopSeed {
  hopName: string;
  amount: number | null;
  boilTime: number | null;
  stage: string;
}

interface RecipeYeastSeed {
  yeastName: string;
  yeastSupplier?: string | null;
  amount?: string | null;
  pitchingRate?: string | null;
  stage: string;
}

interface RecipeWaterSeed {
  waterProfileName: string;
  volume: number | null;
  adjustments?: string | null;
}

interface RecipeMashSeed {
  mashProfileName: string;
  actualEfficiency?: number | null;
}

interface RecipeFermentationSeed {
  fermentationProfileName: string;
  actualAttenuation?: number | null;
  finalAbv?: number | null;
  observations?: string | null;
}

interface RecipeCarbonationSeed {
  carbonationProfileName: string;
  amountUsed?: string | null;
  temperature?: number | null;
  co2Volumes?: number | null;
}

interface RecipeSeedData {
  name: string;
  beerStyleName: string;
  equipmentName?: string | null;
  type: string;
  imageUrl?: string | null;
  about?: string | null;
  notes?: string | null;
  plannedVolume?: number | null;
  targetVolume?: number | null;
  volumeIntoFermenter?: number | null;
  packagedVolume?: number | null;
  finalVolume?: number | null;
  mashVolume?: number | null;
  boilTime?: number | null;
  originalGravity?: number | null;
  finalGravity?: number | null;
  estimatedIbu?: number | null;
  estimatedColor?: number | null;
  estimatedAbv?: number | null;
  actualEfficiency?: number | null;
  mashEfficiency?: number | null;
  brewhouseEfficiency?: number | null;
  preBoilVolume?: number | null;
  postBoilVolume?: number | null;
  brewDate?: string | null;
  mash?: RecipeMashSeed | null;
  fermentation?: RecipeFermentationSeed | null;
  carbonation?: RecipeCarbonationSeed | null;
  fermentables?: RecipeFermentableSeed[];
  hops?: RecipeHopSeed[];
  yeasts?: RecipeYeastSeed[];
  waters?: RecipeWaterSeed[];
}

const mapRecipeType = (type: string): RecipeType => {
  const map: Record<string, RecipeType> = {
    all_grain: RecipeType.ALL_GRAIN,
    partial_mash: RecipeType.PARTIAL_MASH,
    extract: RecipeType.EXTRACT,
  };
  return map[type.toLowerCase()] ?? RecipeType.ALL_GRAIN;
};

const mapFermentableUsage = (
  usage: string | null | undefined,
): FermentableUsageType | null => {
  if (usage == null || usage === '') return null;
  const map: Record<string, FermentableUsageType> = {
    mash: FermentableUsageType.MASH,
    steep: FermentableUsageType.STEEP,
    boil: FermentableUsageType.BOIL,
    late_boil: FermentableUsageType.LATE_BOIL,
    fermentation: FermentableUsageType.FERMENTATION,
  };
  return map[usage.toLowerCase()] ?? null;
};

const mapHopStage = (stage: string): HopStage => {
  const map: Record<string, HopStage> = {
    boil: HopStage.BOIL,
    whirlpool: HopStage.WHIRLPOOL,
    dry_hop: HopStage.DRY_HOP,
  };
  return map[stage.toLowerCase()] ?? HopStage.BOIL;
};

const mapYeastStage = (stage: string): YeastStage => {
  const map: Record<string, YeastStage> = {
    primary: YeastStage.PRIMARY,
    secondary: YeastStage.SECONDARY,
    starter: YeastStage.STARTER,
  };
  return map[stage.toLowerCase()] ?? YeastStage.PRIMARY;
};

export async function seedRecipes(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de receitas...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/recipes.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const recipesData = JSON.parse(jsonData) as RecipeSeedData[];

  console.log(`📖 Encontradas ${recipesData.length} receitas no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of recipesData) {
    try {
      const existing = await em.findOne(Recipe, { name: row.name, user: null });
      if (existing) {
        console.log(`⏭️  Pulando ${row.name} (já existe)`);
        skipped++;
        continue;
      }

      const beerStyle = await em.findOne(BeerStyle, {
        name: row.beerStyleName,
      });
      if (!beerStyle) {
        console.error(
          `❌ Estilo não encontrado: "${row.beerStyleName}" (${row.name})`,
        );
        errors++;
        continue;
      }

      let equipment: Equipment | null = null;
      if (row.equipmentName) {
        equipment = await em.findOne(Equipment, { name: row.equipmentName });
        if (!equipment) {
          console.error(
            `❌ Equipamento não encontrado: "${row.equipmentName}" (${row.name})`,
          );
          errors++;
          continue;
        }
      }

      let mashProfile: MashProfile | null = null;
      if (row.mash) {
        mashProfile = await em.findOne(MashProfile, {
          name: row.mash.mashProfileName,
        });
        if (!mashProfile) {
          console.error(
            `❌ Perfil de mostura não encontrado: "${row.mash.mashProfileName}" (${row.name})`,
          );
          errors++;
          continue;
        }
      }

      let fermentationProfile: FermentationProfile | null = null;
      if (row.fermentation) {
        fermentationProfile = await em.findOne(FermentationProfile, {
          name: row.fermentation.fermentationProfileName,
        });
        if (!fermentationProfile) {
          console.error(
            `❌ Perfil de fermentação não encontrado: "${row.fermentation.fermentationProfileName}" (${row.name})`,
          );
          errors++;
          continue;
        }
      }

      let carbonationProfile: CarbonationProfile | null = null;
      if (row.carbonation) {
        carbonationProfile = await em.findOne(CarbonationProfile, {
          name: row.carbonation.carbonationProfileName,
        });
        if (!carbonationProfile) {
          console.error(
            `❌ Perfil de carbonatação não encontrado: "${row.carbonation.carbonationProfileName}" (${row.name})`,
          );
          errors++;
          continue;
        }
      }

      const fermentableRows: {
        entity: Fermentable;
        seed: RecipeFermentableSeed;
      }[] = [];
      for (const f of row.fermentables ?? []) {
        const fermentable = await em.findOne(Fermentable, {
          name: f.fermentableName,
        });
        if (!fermentable) {
          console.error(
            `❌ Fermentável não encontrado: "${f.fermentableName}" (${row.name})`,
          );
          errors++;
          continue;
        }
        fermentableRows.push({ entity: fermentable, seed: f });
      }
      if (fermentableRows.length !== (row.fermentables ?? []).length) {
        continue;
      }

      const hopRows: { entity: Hop; seed: RecipeHopSeed }[] = [];
      for (const h of row.hops ?? []) {
        const hop = await em.findOne(Hop, { name: h.hopName });
        if (!hop) {
          console.error(
            `❌ Lúpulo não encontrado: "${h.hopName}" (${row.name})`,
          );
          errors++;
          continue;
        }
        hopRows.push({ entity: hop, seed: h });
      }
      if (hopRows.length !== (row.hops ?? []).length) {
        continue;
      }

      const yeastRows: { entity: Yeast; seed: RecipeYeastSeed }[] = [];
      for (const y of row.yeasts ?? []) {
        const yeastFilter =
          y.yeastSupplier !== undefined && y.yeastSupplier !== null
            ? { name: y.yeastName, supplier: y.yeastSupplier }
            : { name: y.yeastName };
        const yeast = await em.findOne(Yeast, yeastFilter);
        if (!yeast) {
          console.error(
            `❌ Levedura não encontrada: "${y.yeastName}" (${row.name})`,
          );
          errors++;
          continue;
        }
        yeastRows.push({ entity: yeast, seed: y });
      }
      if (yeastRows.length !== (row.yeasts ?? []).length) {
        continue;
      }

      const waterRows: { entity: WaterProfile; seed: RecipeWaterSeed }[] = [];
      for (const w of row.waters ?? []) {
        const waterProfile = await em.findOne(WaterProfile, {
          name: w.waterProfileName,
        });
        if (!waterProfile) {
          console.error(
            `❌ Perfil de água não encontrado: "${w.waterProfileName}" (${row.name})`,
          );
          errors++;
          continue;
        }
        waterRows.push({ entity: waterProfile, seed: w });
      }
      if (waterRows.length !== (row.waters ?? []).length) {
        continue;
      }

      const recipe = em.create(Recipe, {
        user: null,
        beerStyle,
        equipment,
        isDraft: false,
        name: row.name,
        imageUrl: row.imageUrl ?? null,
        about: row.about ?? null,
        notes: row.notes ?? null,
        type: mapRecipeType(row.type),
        plannedVolume: row.plannedVolume ?? null,
        targetVolume: row.targetVolume ?? null,
        volumeIntoFermenter: row.volumeIntoFermenter ?? null,
        packagedVolume: row.packagedVolume ?? null,
        finalVolume: row.finalVolume ?? null,
        mashVolume: row.mashVolume ?? null,
        boilTime: row.boilTime ?? null,
        originalGravity: row.originalGravity ?? null,
        finalGravity: row.finalGravity ?? null,
        estimatedIbu: row.estimatedIbu ?? null,
        estimatedColor: row.estimatedColor ?? null,
        estimatedAbv: row.estimatedAbv ?? null,
        actualEfficiency: row.actualEfficiency ?? null,
        mashEfficiency: row.mashEfficiency ?? null,
        brewhouseEfficiency: row.brewhouseEfficiency ?? null,
        preBoilVolume: row.preBoilVolume ?? null,
        postBoilVolume: row.postBoilVolume ?? null,
        brewDate: row.brewDate ? new Date(row.brewDate) : null,
      });

      if (row.mash && mashProfile) {
        em.create(RecipeMash, {
          recipe,
          mashProfile,
          actualEfficiency: row.mash.actualEfficiency ?? null,
        });
      }

      if (row.fermentation && fermentationProfile) {
        em.create(RecipeFermentation, {
          recipe,
          fermentationProfile,
          actualAttenuation: row.fermentation.actualAttenuation ?? null,
          finalAbv: row.fermentation.finalAbv ?? null,
          observations: row.fermentation.observations ?? null,
        });
      }

      if (row.carbonation && carbonationProfile) {
        em.create(RecipeCarbonation, {
          recipe,
          carbonationProfile,
          amountUsed: row.carbonation.amountUsed ?? null,
          temperature: row.carbonation.temperature ?? null,
          co2Volumes: row.carbonation.co2Volumes ?? null,
        });
      }

      for (const { entity: fermentable, seed: f } of fermentableRows) {
        em.create(RecipeFermentable, {
          recipe,
          fermentable,
          amount: f.amount,
          usageType: mapFermentableUsage(f.usageType),
        });
      }

      for (const { entity: hop, seed: h } of hopRows) {
        em.create(RecipeHop, {
          recipe,
          hop,
          amount: h.amount,
          boilTime: h.boilTime,
          stage: mapHopStage(h.stage),
        });
      }

      for (const { entity: yeast, seed: y } of yeastRows) {
        em.create(RecipeYeast, {
          recipe,
          yeast,
          amount: y.amount ?? null,
          pitchingRate: y.pitchingRate ?? null,
          stage: mapYeastStage(y.stage),
        });
      }

      for (const { entity: waterProfile, seed: w } of waterRows) {
        em.create(RecipeWater, {
          recipe,
          waterProfile,
          volume: w.volume,
          adjustments: w.adjustments ?? null,
        });
      }

      created++;
      console.log(`✅ Criado: ${row.name}`);
    } catch (error) {
      errors++;
      console.error(`❌ Erro ao criar ${row.name}:`, error);
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
  console.log(`   - Total processado: ${recipesData.length}`);
}
