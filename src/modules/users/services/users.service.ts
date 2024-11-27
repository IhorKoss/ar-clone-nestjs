import { Injectable } from '@nestjs/common';
import { SourceCode } from 'eslint';

import { UserID } from '../../../common/types/entity-ids.type';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import Config = SourceCode.Config;
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private userRepository: UserRepository,
  ) {}

  public async findMe(userData: IUserData) {
    return `This action returns a #${userData.userId} user`;
  }

  public async updateMe(userData: IUserData, dto: UpdateUserReqDto) {
    return `This action updates a #${userData.userId} user`;
  }

  public async removeMe(userData: IUserData) {
    return `This action removes a #${userData.userId} user`;
  }

  public async findOne(userId: UserID) {
    return `This action returns a #${userId} user`;
  }
}
