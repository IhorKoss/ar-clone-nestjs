import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AdID, FavouritesID, UserID } from '../../common/types/entity-ids.type';
import { AdEntity } from './ad.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';

@Index(['user_id', 'ad_id'], { unique: true })
@Entity(TableNameEnum.FAVOURITES)
export class FavouritesEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: FavouritesID;

  @Column()
  user_id: UserID;
  @ManyToOne(() => UserEntity, (entity) => entity.favourites)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column()
  ad_id: AdID;
  @ManyToOne(() => AdEntity, (entity) => entity.favourites)
  @JoinColumn({ name: 'ad_id' })
  ad?: AdEntity;
}
