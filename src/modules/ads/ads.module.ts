import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ProfanityFilter } from '../../common/filters/profanity.filter';
import { RolesGuard } from '../users/guards/roles.guard';
import { AdsController } from './ads.controller';
import { CurrencyService } from './services/ads.currency.service';
import { AdsManagerService } from './services/ads.manager.service';
import { AdsService } from './services/ads.service';

@Module({
  imports: [HttpModule, ProfanityFilter],
  controllers: [AdsController],
  providers: [
    AdsService,
    AdsManagerService,
    CurrencyService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AdsModule {}
