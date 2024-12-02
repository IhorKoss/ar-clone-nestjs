import { BadRequestException, Injectable } from '@nestjs/common';

import { AdID } from '../../../common/types/entity-ids.type';
import { AdEntity } from '../../../database/entities/ad.entity';
import { AdRepository } from '../../repository/services/ad.repository';

@Injectable()
export class AdsManagerService {
  constructor(private readonly adRepository: AdRepository) {}

  public async findInactive(): Promise<[AdEntity[], number]> {
    return await this.adRepository.findInactive();
  }

  public async deleteAd(adId: AdID): Promise<string> {
    const ad = await this.adRepository.findOneBy({ id: adId });
    if (!ad) {
      throw new BadRequestException('Ad not found');
    }
    await this.adRepository.delete(adId);
    return `Ad with id: ${adId} deleted`;
  }
}
