import { BadRequestException, Injectable } from '@nestjs/common';

import { UserID } from '../../../common/types/entity-ids.type';
import { AccountType } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async findMe(userData: IUserData) {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }

  public async updateMe(userData: IUserData, dto: UpdateUserReqDto) {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    this.userRepository.merge(user, dto);
    return await this.userRepository.save(user);
  }

  public async removeMe(userData: IUserData) {
    await this.userRepository.update(
      { id: userData.userId },
      { deleted: new Date() },
    );
    await this.refreshTokenRepository.delete({ user_id: userData.userId });
  }

  public async purchasePremium(userData: IUserData) {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.accountType === AccountType.PREMIUM) {
      throw new BadRequestException('You already has a premium account');
    }
    user.accountType = AccountType.PREMIUM;
    return await this.userRepository.save(user);
  }

  public async removeUserById(userId: UserID) {
    await this.userRepository.update({ id: userId }, { deleted: new Date() });
  }

  public async findOne(userId: UserID) {
    return await this.userRepository.findOneBy({ id: userId });
  }
}
