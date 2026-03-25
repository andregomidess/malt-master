import { EntityManager } from '@mikro-orm/postgresql';
import { BeerStyle, BeerTag } from '../../catalog/entities/beer-style.entity';
import * as fs from 'fs';
import * as path from 'path';

interface BJCPBeerStyle {
  name: string;
  number: string;
  category: string;
  categorynumber: string;
  overallimpression?: string;
  aroma?: string;
  appearance?: string;
  flavor?: string;
  mouthfeel?: string;
  comments?: string;
  history?: string;
  characteristicingredients?: string;
  stylecomparison?: string;
  ibumin?: string;
  ibumax?: string;
  ogmin?: string;
  ogmax?: string;
  fgmin?: string;
  fgmax?: string;
  abvmin?: string;
  abvmax?: string;
  srmmin?: string;
  srmmax?: string;
  commercialexamples?: string;
  tags?: string;
}

const srmToEbc = (srm: number): number => {
  return srm * 1.97;
};

const mapTagsToBeerTags = (tagsString: string): BeerTag[] => {
  const tags: BeerTag[] = [];
  const tagMap: Record<string, BeerTag> = {
    hoppy: BeerTag.HOPPY,
    malty: BeerTag.MALTY,
    fruity: BeerTag.FRUITY,
    spice: BeerTag.SPICY,
    roasted: BeerTag.ROASTED,
    roasty: BeerTag.ROASTY,
    dark: BeerTag.DARK,
    light: BeerTag.LIGHT,
    sour: BeerTag.SOUR,
    sweet: BeerTag.SWEET,
    bitter: BeerTag.BITTER,
    smooth: BeerTag.SMOOTH,
    crisp: BeerTag.CRISP,
    refreshing: BeerTag.REFRESHING,
    complex: BeerTag.COMPLEX,
    traditional: BeerTag.TRADITIONAL,
    modern: BeerTag.MODERN,
    strong: BeerTag.STRONG,
    wheat: BeerTag.WHEAT,
    coffee: BeerTag.COFFEE,
    chocolate: BeerTag.CHOCOLATE,
    caramel: BeerTag.CARAMEL,
    citrus: BeerTag.CITRUS,
    tropical: BeerTag.TROPICAL,
    floral: BeerTag.FLORAL,
    earthy: BeerTag.EARTHY,
    herbal: BeerTag.HERBAL,
    smoky: BeerTag.SMOKY,
    smoke: BeerTag.SMOKY,
    balanced: BeerTag.BALANCED,
    'session-strength': BeerTag.SESSIONABLE,
    'standard-strength': BeerTag.SESSIONABLE,
  };

  const tagArray = tagsString.split(',').map((t) => t.trim().toLowerCase());

  tagArray.forEach((tag) => {
    const mappedTag = tagMap[tag];
    if (mappedTag && !tags.includes(mappedTag)) {
      tags.push(mappedTag);
    }
  });

  return tags;
};

const extractSubCategory = (number: string): string | null => {
  const match = number.match(/^\d+([A-Z])$/);
  return match ? match[1] : null;
};

const parseGravity = (value?: string): number | null => {
  if (!value) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

const parseNumber = (value?: string): number | null => {
  if (!value) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

export async function seedBeerStyles(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de estilos de cerveja BJCP...');

  let jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/styles.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    jsonPath = path.join(process.cwd(), 'styles.seed.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(
        `Arquivo não encontrado em: src/database/seeds/data/styles.seed.json ou styles.json na raiz`,
      );
    }
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const bjcpStyles = JSON.parse(jsonData) as BJCPBeerStyle[];

  console.log(`📖 Encontrados ${bjcpStyles.length} estilos no arquivo JSON`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const bjcpStyle of bjcpStyles) {
    try {
      const existing = await em.findOne(BeerStyle, { name: bjcpStyle.name });

      if (existing) {
        console.log(`⏭️  Pulando ${bjcpStyle.name} (já existe)`);
        skipped++;
        continue;
      }

      const minColorEbc = bjcpStyle.srmmin
        ? srmToEbc(parseNumber(bjcpStyle.srmmin)!)
        : null;
      const maxColorEbc = bjcpStyle.srmmax
        ? srmToEbc(parseNumber(bjcpStyle.srmmax)!)
        : null;

      em.create(BeerStyle, {
        name: bjcpStyle.name,
        category: bjcpStyle.category || null,
        subCategory: extractSubCategory(bjcpStyle.number),
        minAbv: parseNumber(bjcpStyle.abvmin),
        maxAbv: parseNumber(bjcpStyle.abvmax),
        minOg: parseGravity(bjcpStyle.ogmin),
        maxOg: parseGravity(bjcpStyle.ogmax),
        minFg: parseGravity(bjcpStyle.fgmin),
        maxFg: parseGravity(bjcpStyle.fgmax),
        minIbu: parseNumber(bjcpStyle.ibumin),
        maxIbu: parseNumber(bjcpStyle.ibumax),
        minColorEbc: minColorEbc,
        maxColorEbc: maxColorEbc,
        description: bjcpStyle.overallimpression || null,
        aroma: bjcpStyle.aroma || null,
        appearance: bjcpStyle.appearance || null,
        flavor: bjcpStyle.flavor || null,
        mouthfeel: bjcpStyle.mouthfeel || null,
        comments: bjcpStyle.comments || null,
        history: bjcpStyle.history || null,
        ingredients: bjcpStyle.characteristicingredients || null,
        tags: bjcpStyle.tags ? mapTagsToBeerTags(bjcpStyle.tags) : [],
        examples: bjcpStyle.commercialexamples || null,
        origin: null,
        glassware: null,
        user: null,
        createdAt: new Date(),
      });

      created++;
      console.log(`✅ Criado: ${bjcpStyle.name}`);
    } catch (error) {
      errors++;
      console.error(`❌ Erro ao criar ${bjcpStyle.name}:`, error);
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
  console.log(`   - Total processado: ${bjcpStyles.length}`);
}
