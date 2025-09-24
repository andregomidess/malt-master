import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  Equipment,
  KettleEquipment,
  FermenterEquipment,
  ChillerEquipment,
  EquipmentType,
} from '../entities/equipment.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { equipmentResolver } from '../resolvers/equipment.resolver';
import { type EquipmentInputUnion } from '../inputs/equipment.input';

@Injectable()
export class EquipmentService extends BaseEntityService<Equipment> {
  constructor(em: EntityManager) {
    super(em, Equipment, equipmentResolver);
  }

  override async save(data: EquipmentInputUnion): Promise<Equipment> {
    return await super.save(data);
  }

  async findAll(): Promise<Equipment[]> {
    return await this.em.find(Equipment, {});
  }

  async findKettles(): Promise<KettleEquipment[]> {
    return await this.em.find(KettleEquipment, {});
  }

  async findFermenters(): Promise<FermenterEquipment[]> {
    return await this.em.find(FermenterEquipment, {});
  }

  async findChillers(): Promise<ChillerEquipment[]> {
    return await this.em.find(ChillerEquipment, {});
  }

  async findByType<T extends Equipment>(type: EquipmentType): Promise<T[]> {
    return (await this.em.find(Equipment, { type })) as T[];
  }

  override async findById(id: string): Promise<Equipment | null> {
    return await super.findById(id);
  }

  override async softDelete(id: string): Promise<Equipment> {
    return await super.softDelete(id);
  }

  override async recovery(id: string): Promise<Equipment> {
    return await super.recovery(id);
  }
}
