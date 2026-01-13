import type { EntityManager } from '@mikro-orm/postgresql';
import {
  Equipment,
  EquipmentMaterial,
  HeatingSource,
  CoolingType,
  ChillerType,
  KettleEquipment,
  FermenterEquipment,
  ChillerEquipment,
  EquipmentType,
} from '../../catalog/entities/equipment.entity';
import * as fs from 'fs';
import * as path from 'path';

interface EquipmentData {
  name: string;
  description: string | null;
  user: null;
  type: string;
  material: string;
  totalCapacity: number;
  usableVolume: number;
  // Kettle fields
  kettleLoss?: number;
  evaporationRate?: number;
  boilOffRate?: number;
  heatingPower?: number;
  heatingSource?: string;
  // Fermenter fields
  fermenterLoss?: number;
  coneBottomVolume?: number;
  hasTemperatureControl?: boolean;
  maxPressure?: number;
  coolingType?: string;
  minTemperature?: number;
  maxTemperature?: number;
  // Chiller fields
  coolingCapacity?: number;
  flowRate?: number;
  inletTemperature?: number;
  outletTemperature?: number;
  chillerType?: string;
  tubeLength?: number;
  tubeDiameter?: number;
}

const mapMaterial = (material: string): EquipmentMaterial => {
  const materialMap: Record<string, EquipmentMaterial> = {
    stainless_steel: EquipmentMaterial.STAINLESS_STEEL,
    aluminum: EquipmentMaterial.ALUMINUM,
    plastic: EquipmentMaterial.PLASTIC,
    glass: EquipmentMaterial.GLASS,
    copper: EquipmentMaterial.COPPER,
  };

  return (
    materialMap[material.toLowerCase()] || EquipmentMaterial.STAINLESS_STEEL
  );
};

const mapHeatingSource = (source: string): HeatingSource => {
  const sourceMap: Record<string, HeatingSource> = {
    gas: HeatingSource.GAS,
    electric: HeatingSource.ELECTRIC,
    induction: HeatingSource.INDUCTION,
    steam: HeatingSource.STEAM,
    direct_fire: HeatingSource.DIRECT_FIRE,
  };

  return sourceMap[source.toLowerCase()] || HeatingSource.ELECTRIC;
};

const mapCoolingType = (type: string): CoolingType => {
  const typeMap: Record<string, CoolingType> = {
    air_conditioning: CoolingType.AIR_CONDITIONING,
    glycol: CoolingType.GLYCOL,
    immersion_coil: CoolingType.IMMERSION_COIL,
    plate_chiller: CoolingType.PLATE_CHILLER,
    natural: CoolingType.NATURAL,
  };

  return typeMap[type.toLowerCase()] || CoolingType.NATURAL;
};

const mapChillerType = (type: string): ChillerType => {
  const typeMap: Record<string, ChillerType> = {
    counterflow: ChillerType.COUNTERFLOW,
    plate: ChillerType.PLATE,
    immersion: ChillerType.IMMERSION,
    ice_bath: ChillerType.ICE_BATH,
  };

  return typeMap[type.toLowerCase()] || ChillerType.IMMERSION;
};

export async function seedEquipment(em: EntityManager): Promise<void> {
  console.log('🌱 Iniciando seed de equipamentos...');

  const jsonPath = path.join(
    process.cwd(),
    'src/database/seeds/data/equipment.seed.json',
  );

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Arquivo não encontrado em: ${jsonPath}`);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const equipmentData = JSON.parse(jsonData) as EquipmentData[];

  console.log(
    `📖 Encontrados ${equipmentData.length} equipamentos no arquivo JSON`,
  );

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const eqData of equipmentData) {
    try {
      const existing = await em.findOne(Equipment, { name: eqData.name });

      if (existing) {
        console.log(`⏭️  Pulando ${eqData.name} (já existe)`);
        skipped++;
        continue;
      }

      const baseData = {
        name: eqData.name,
        description: eqData.description || null,
        user: null,
        totalCapacity: eqData.totalCapacity,
        usableVolume: eqData.usableVolume,
        material: mapMaterial(eqData.material),
        createdAt: new Date(),
      };

      if (eqData.type === 'kettle') {
        em.create(KettleEquipment, {
          ...baseData,
          type: EquipmentType.KETTLE,
          kettleLoss: eqData.kettleLoss!,
          evaporationRate: eqData.evaporationRate!,
          boilOffRate: eqData.boilOffRate!,
          heatingPower: eqData.heatingPower!,
          heatingSource: mapHeatingSource(eqData.heatingSource!),
        });
      } else if (eqData.type === 'fermenter') {
        em.create(FermenterEquipment, {
          ...baseData,
          type: EquipmentType.FERMENTER,
          fermenterLoss: eqData.fermenterLoss!,
          coneBottomVolume: eqData.coneBottomVolume || 0,
          hasTemperatureControl: eqData.hasTemperatureControl ?? false,
          maxPressure: eqData.maxPressure || 0,
          coolingType: mapCoolingType(eqData.coolingType!),
          minTemperature: eqData.minTemperature!,
          maxTemperature: eqData.maxTemperature!,
        });
      } else if (eqData.type === 'chiller') {
        em.create(ChillerEquipment, {
          ...baseData,
          type: EquipmentType.CHILLER,
          coolingCapacity: eqData.coolingCapacity!,
          flowRate: eqData.flowRate!,
          inletTemperature: eqData.inletTemperature!,
          outletTemperature: eqData.outletTemperature!,
          chillerType: mapChillerType(eqData.chillerType!),
          tubeLength: eqData.tubeLength!,
          tubeDiameter: eqData.tubeDiameter!,
        });
      } else {
        throw new Error(`Tipo de equipamento desconhecido: ${eqData.type}`);
      }

      created++;
      console.log(`✅ Criado: ${eqData.name}`);
    } catch (error) {
      errors++;
      console.error(`❌ Erro ao criar ${eqData.name}:`, error);
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
  console.log(`   - Total processado: ${equipmentData.length}`);
}
