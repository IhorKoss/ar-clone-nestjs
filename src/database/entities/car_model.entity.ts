import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CarModelID } from '../../common/types/entity-ids.type';
import { AdEntity } from './ad.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';

@Entity(TableNameEnum.CAR_MODELS)
export class CarModelEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: CarModelID;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => AdEntity, (entity) => entity.model)
  ads?: AdEntity[];
}
