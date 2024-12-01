import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SignUpReqDto } from '../auth/models/dto/req/sign-up.req.dto';
import { AuthResDto } from '../auth/models/dto/res/auth.res.dto';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { AuthService } from '../auth/services/auth.service';
import { AdminRequired, ManagerRequired } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UserResDto } from './models/dto/res/user.res.dto';
import { ManagerUserService } from './services/manager-service';
import { UserMapper } from './services/user.mapper';
import { UsersService } from './services/users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly managerService: ManagerUserService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResDto(result);
  }

  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const result = await this.usersService.updateMe(userData, updateUserDto);
    return UserMapper.toResDto(result);
  }

  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.usersService.removeMe(userData);
  }

  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<UserResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }

  @AdminRequired()
  @Post('create-manager')
  public async createManager(
    @Body() signUpReqDto: SignUpReqDto,
  ): Promise<UserResDto> {
    return await this.authService.createManager(signUpReqDto);
  }

  @ManagerRequired()
  @Post('ban/:userId')
  public async banUser(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<string> {
    return await this.managerService.banUser(userId);
  }
}
