import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BannedEmailID } from '../../common/types/entity-ids.type';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';

@Entity(TableNameEnum.BANNED_EMAILS)
export class BannedEmailsEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: BannedEmailID;

  @Column('text')
  email: string;
}
