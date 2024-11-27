import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AdID, AnalyticsID } from '../../common/types/entity-ids.type';
import { AdEntity } from './ad.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';

@Entity(TableNameEnum.ANALYTICS)
export class AnalyticsEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: AnalyticsID;

  @Column()
  ad_id: AdID;
  @OneToOne(() => AdEntity, (entity) => entity.analytics)
  @JoinColumn({ name: 'ad_id' })
  ad?: AdEntity;

  @Column('int', { default: 0 })
  views: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  average_price: number;
}
