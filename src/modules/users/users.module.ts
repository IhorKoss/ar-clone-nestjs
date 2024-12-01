import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { ManagerUserService } from './services/manager-service';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ManagerUserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RolesGuard,
  ],
  exports: [RolesGuard],
})
export class UsersModule {}
