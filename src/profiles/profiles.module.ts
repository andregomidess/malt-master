import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MashProfileController } from './controllers/mash-profile.controller';
import { FermentationProfileController } from './controllers/fermentation-profile.controller';
import { CarbonationProfileController } from './controllers/carbonation-profile.controller';

import { MashProfileService } from './services/mash-profile.service';
import { FermentationProfileService } from './services/fermentation-profile.service';
import { CarbonationProfileService } from './services/carbonation-profile.service';

import { MashProfile } from './entities/mash-profile.entity';
import { MashStep } from './entities/mash-step.entity';
import { FermentationProfile } from './entities/fermentation-profile.entity';
import { FermentationStep } from './entities/fermentation-step.entity';
import { CarbonationProfile } from './entities/carbonation-profile.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      MashProfile,
      MashStep,
      FermentationProfile,
      FermentationStep,
      CarbonationProfile,
    ]),
  ],
  controllers: [
    MashProfileController,
    FermentationProfileController,
    CarbonationProfileController,
  ],
  providers: [
    MashProfileService,
    FermentationProfileService,
    CarbonationProfileService,
  ],
  exports: [
    MashProfileService,
    FermentationProfileService,
    CarbonationProfileService,
  ],
})
export class ProfilesModule {}
