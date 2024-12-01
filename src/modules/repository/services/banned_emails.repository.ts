import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BannedEmailsEntity } from '../../../database/entities/banned_emails.entity';

@Injectable()
export class BannedEmailsRepository extends Repository<BannedEmailsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BannedEmailsEntity, dataSource.manager);
  }
}
