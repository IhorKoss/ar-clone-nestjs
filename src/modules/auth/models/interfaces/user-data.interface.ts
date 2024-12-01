import { UserID } from '../../../../common/types/entity-ids.type';
import {
  AccountType,
  UserRole,
} from '../../../../database/entities/user.entity';

export interface IUserData {
  userId: UserID;
  deviceId: string;
  email: string;
  accountType: AccountType;
  role: UserRole;
}
