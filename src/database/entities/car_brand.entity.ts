import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CarBrandID } from '../../common/types/entity-ids.type';
import { AdEntity } from './ad.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';

@Entity(TableNameEnum.CAR_BRANDS)
export class CarBrandEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: CarBrandID;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => AdEntity, (entity) => entity.brand)
  ads?: AdEntity[];
}
