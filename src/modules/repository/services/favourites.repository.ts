import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FavouritesEntity } from '../../../database/entities/favourites.entity';

@Injectable()
export class FavouritesRepository extends Repository<FavouritesEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FavouritesEntity, dataSource.manager);
  }
}
