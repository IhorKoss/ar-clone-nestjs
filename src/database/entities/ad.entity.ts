import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  AdID,
  CarBrandID,
  CarModelID,
  UserID,
} from '../../common/types/entity-ids.type';
import { AnalyticsEntity } from './analytics.entity';
import { CarBrandEntity } from './car_brand.entity';
import { CarModelEntity } from './car_model.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { FavouritesEntity } from './favourites.entity';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';

export enum AdStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export enum AdCurrency {
  UAH = 'uah',
  USD = 'usd',
  EUR = 'eur',
}

@Entity(TableNameEnum.ADS)
export class AdEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: AdID;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  phone: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: AdCurrency,
    default: AdCurrency.UAH,
  })
  currency: AdCurrency;

  @Column('json', { default: {} })
  convertedPrices: { usd: number; eur: number; uah: number };

  @Column('json', { default: {} })
  exchangeRates: { usd: number; eur: number; uah: number };

  @Column({
    type: 'enum',
    enum: AdStatus,
    default: AdStatus.ACTIVE,
  })
  status: AdStatus;

  @Column()
  user_id: UserID;
  @ManyToOne(() => UserEntity, (entity) => entity.ads)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column('uuid', { nullable: true })
  brand_id: CarBrandID;
  @ManyToOne(() => CarBrandEntity, (entity) => entity.ads)
  @JoinColumn({ name: 'brand_id' })
  brand?: CarBrandEntity;

  @Column('uuid', { nullable: true })
  model_id: CarModelID;
  @ManyToOne(() => CarModelEntity, (entity) => entity.ads)
  @JoinColumn({ name: 'model_id' })
  model?: CarModelEntity;

  @OneToMany(() => FavouritesEntity, (entity) => entity.ad)
  favourites?: FavouritesEntity[];

  @OneToOne(() => AnalyticsEntity, (entity) => entity.ad)
  analytics?: AnalyticsEntity;

  @Column({ type: 'int', default: 0 })
  editAttempts: number;
}
