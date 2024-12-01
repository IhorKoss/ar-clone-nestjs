import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../../../database/entities/user.entity';

const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
export const AdminRequired = () => Roles(UserRole.ADMIN);
export const ManagerRequired = () => Roles(UserRole.MANAGER, UserRole.ADMIN);
