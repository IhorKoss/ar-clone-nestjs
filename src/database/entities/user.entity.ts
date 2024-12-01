import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserID } from '../../common/types/entity-ids.type';
import { AdEntity } from './ad.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { FavouritesEntity } from './favourites.entity';
import { CreateUpdateModel } from './models/create-update.model';
import { RefreshTokenEntity } from './refresh-token.entity';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export enum AccountType {
  BASIC = 'basic',
  PREMIUM = 'premium',
}

@Entity(TableNameEnum.USERS)
export class UserEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: UserID;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BUYER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.BASIC,
  })
  accountType: AccountType;

  @Column('timestamp', { nullable: true })
  deleted?: Date;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => AdEntity, (entity) => entity.user)
  ads?: AdEntity[];

  @OneToMany(() => FavouritesEntity, (entity) => entity.user)
  favourites?: FavouritesEntity[];
}
