import { Injectable, NotFoundException } from '@nestjs/common';

import { UserID } from '../../../common/types/entity-ids.type';
import { BannedEmailsRepository } from '../../repository/services/banned_emails.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UsersService } from './users.service';

@Injectable()
export class ManagerUserService {
  constructor(
    private userRepository: UserRepository,
    private bannedEmailRepository: BannedEmailsRepository,
    private usersService: UsersService,
  ) {}

  async banUser(userId: UserID): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.removeUserById(user.id);

    const bannedEmail = this.bannedEmailRepository.create({
      email: user.email,
    });
    await this.bannedEmailRepository.save(bannedEmail);

    return `Successfully banned user with ${user.email} email.`;
  }
}
