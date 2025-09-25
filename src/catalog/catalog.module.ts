import { Module } from '@nestjs/common';

import { BeerStyleController } from './controllers/beer-style.controller';
import { EquipmentController } from './controllers/equipment.controller';
import { FermentableController } from './controllers/fermentable.controller';
import { HopController } from './controllers/hop.controller';
import { WaterProfileController } from './controllers/water-profile.controller';
import { YeastController } from './controllers/yeast.controller';

import { BeerStyleService } from './services/beer-style.service';
import { EquipmentService } from './services/equipment.service';
import { FermentableService } from './services/fermentable.service';
import { HopService } from './services/hop.service';
import { WaterProfileService } from './services/water-profile.service';
import { YeastService } from './services/yeast.service';

@Module({
  imports: [],
  controllers: [
    BeerStyleController,
    EquipmentController,
    FermentableController,
    HopController,
    WaterProfileController,
    YeastController,
  ],
  providers: [
    BeerStyleService,
    EquipmentService,
    FermentableService,
    HopService,
    WaterProfileService,
    YeastService,
  ],
  exports: [
    BeerStyleService,
    EquipmentService,
    FermentableService,
    HopService,
    WaterProfileService,
    YeastService,
  ],
})
export class CatalogModule {}
