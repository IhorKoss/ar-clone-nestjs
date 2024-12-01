import { BadRequestException, Injectable } from '@nestjs/common';

import { ProfanityFilter } from '../../../common/filters/profanity.filter';
import { AdID } from '../../../common/types/entity-ids.type';
import { AdEntity, AdStatus } from '../../../database/entities/ad.entity';
import { CarBrandEntity } from '../../../database/entities/car_brand.entity';
import { CarModelEntity } from '../../../database/entities/car_model.entity';
import { AccountType, UserRole } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { AdRepository } from '../../repository/services/ad.repository';
import { CarBrandRepository } from '../../repository/services/car_brand.repository';
import { CarModelRepository } from '../../repository/services/car_model.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CreateAdReqDto } from '../dto/req/create-ad.req.dto';
import { ListAdQueryDto } from '../dto/req/list-ad-query.req.dto';
import { UpdateAdReqDto } from '../dto/req/update-ad.req.dto';
import { CurrencyService } from './ads.currency.service';

@Injectable()
export class AdsManagerService {
  constructor(
    private readonly adRepository: AdRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async findInactive(): Promise<[AdEntity[], number]> {
    return await this.adRepository.findInactive();
  }

  public async deleteAd(adId: AdID): Promise<string> {
    const ad = await this.adRepository.getById(adId);
    if (!ad) {
      throw new BadRequestException('Ad not found');
    }
    await this.adRepository.delete(adId);
    return `Ad with id: ${adId} deleted`;
  }
}
