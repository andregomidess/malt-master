import { EntityClass } from '@mikro-orm/core';
import {
  ChillerEquipment,
  EquipmentType,
  FermenterEquipment,
  KettleEquipment,
} from '../entities/equipment.entity';

import { Equipment } from '../entities/equipment.entity';

export const equipmentResolver = (
  data: Partial<Equipment>,
): EntityClass<Equipment> => {
  switch (data.type) {
    case EquipmentType.KETTLE:
      return KettleEquipment as EntityClass<Equipment>;

    case EquipmentType.FERMENTER:
      return FermenterEquipment as EntityClass<Equipment>;

    case EquipmentType.CHILLER:
      return ChillerEquipment as EntityClass<Equipment>;

    default:
      return Equipment as EntityClass<Equipment>;
  }
};
