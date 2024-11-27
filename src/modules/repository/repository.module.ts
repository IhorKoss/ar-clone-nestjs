import { Global, Module } from '@nestjs/common';

import { AdRepository } from './services/ad.repository';
import { AnalyticsRepository } from './services/analytics.repository';
import { CarBrandRepository } from './services/car_brand.repository';
import { CarModelRepository } from './services/car_model.repository';
import { FavouritesRepository } from './services/favourites.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  AdRepository,
  AnalyticsRepository,
  CarBrandRepository,
  CarModelRepository,
  FavouritesRepository,
  RefreshTokenRepository,
  UserRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
