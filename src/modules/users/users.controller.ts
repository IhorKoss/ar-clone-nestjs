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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
  @ApiOperation({
    summary: 'Get current user',
    description: 'Shows current user',
  })
  public async findMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResDto(result);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user',
    description: 'Updates current user',
  })
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const result = await this.usersService.updateMe(userData, updateUserDto);
    return UserMapper.toResDto(result);
  }

  @Patch('me/premium')
  @ApiOperation({
    summary: 'Purchase premium',
    description: 'Purchases premium account',
  })
  public async purchasePremium(
    @CurrentUser() userData: IUserData,
  ): Promise<UserResDto> {
    const result = await this.usersService.purchasePremium(userData);
    return UserMapper.toResDto(result);
  }

  @Delete('me')
  @ApiOperation({
    summary: 'Remove current user',
    description: 'Removes current user',
  })
  public async removeMe(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.usersService.removeMe(userData);
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Shows user by id',
  })
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<UserResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }

  @AdminRequired()
  @ApiOperation({
    summary: 'Create manager',
    description: 'ATTENTION: only for admins. Creates manager account',
  })
  @Post('create-manager')
  public async createManager(
    @Body() signUpReqDto: SignUpReqDto,
  ): Promise<UserResDto> {
    return await this.authService.createManager(signUpReqDto);
  }

  @ManagerRequired()
  @ApiOperation({
    summary: 'Ban user',
    description: 'ATTENTION: only for managers and above. Bans user',
  })
  @Post('ban/:userId')
  public async banUser(
    @Param('userId', ParseUUIDPipe) userId: UserID,
  ): Promise<string> {
    return await this.managerService.banUser(userId);
  }
}
