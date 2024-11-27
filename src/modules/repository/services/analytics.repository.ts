import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AnalyticsEntity } from '../../../database/entities/analytics.entity';

@Injectable()
export class AnalyticsRepository extends Repository<AnalyticsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AnalyticsEntity, dataSource.manager);
  }
}
