import { Module } from '@nestjs/common';

import { MashProfileController } from './controllers/mash-profile.controller';
import { FermentationProfileController } from './controllers/fermentation-profile.controller';
import { CarbonationProfileController } from './controllers/carbonation-profile.controller';

import { MashProfileService } from './services/mash-profile.service';
import { FermentationProfileService } from './services/fermentation-profile.service';
import { CarbonationProfileService } from './services/carbonation-profile.service';

@Module({
  imports: [],
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
