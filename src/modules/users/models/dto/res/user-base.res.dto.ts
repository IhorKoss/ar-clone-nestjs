import {
  AccountType,
  UserRole,
} from '../../../../../database/entities/user.entity';

export class UserBaseResDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountType: AccountType;
}
