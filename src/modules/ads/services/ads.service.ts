import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProfanityFilter } from '../../../common/filters/profanity.filter';
import { AdID, UserID } from '../../../common/types/entity-ids.type';
import { AdEntity, AdStatus } from '../../../database/entities/ad.entity';
import { CarBrandEntity } from '../../../database/entities/car_brand.entity';
import { CarModelEntity } from '../../../database/entities/car_model.entity';
import { AccountType, UserRole } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { AdRepository } from '../../repository/services/ad.repository';
import { CarBrandRepository } from '../../repository/services/car_brand.repository';
import { CarModelRepository } from '../../repository/services/car_model.repository';
import { FavouritesRepository } from '../../repository/services/favourites.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CreateAdReqDto } from '../dto/req/create-ad.req.dto';
import { ListAdQueryDto } from '../dto/req/list-ad-query.req.dto';
import { UpdateAdReqDto } from '../dto/req/update-ad.req.dto';
import { CurrencyService } from './ads.currency.service';

@Injectable()
export class AdsService {
  constructor(
    private readonly adRepository: AdRepository,
    private readonly userRepository: UserRepository,
    private readonly brandRepository: CarBrandRepository,
    private readonly modelRepository: CarModelRepository,
    private readonly currencyService: CurrencyService,
    private readonly favouritesRepository: FavouritesRepository,
  ) {}

  public async create(
    userData: IUserData,
    dto: CreateAdReqDto,
  ): Promise<AdEntity> {
    const brand = await this.createBrand(dto.brand);
    const model = await this.createModel(dto.model);
    const [userAds] = await this.adRepository.getByUser(userData);
    if (userData.role === UserRole.BUYER) {
      await this.userRepository.update(userData.userId, {
        role: UserRole.SELLER,
      });
    }
    if (userAds.length !== 0 && userData.accountType === AccountType.BASIC) {
      throw new BadRequestException(
        'You can have only 1 active ad. Upgrade your account to have more.',
      );
    }
    const [convertedPrices, exchangeRates] =
      await this.currencyService.convertAdPrice(dto.price, dto.currency);
    return await this.adRepository.save(
      this.adRepository.create({
        ...dto,
        brand: brand,
        model: model,
        convertedPrices: convertedPrices,
        exchangeRates: exchangeRates,
        user: { id: userData.userId },
      }),
    );
  }

  public async findAll(
    query: ListAdQueryDto,
    userData: IUserData,
  ): Promise<[AdEntity[], number]> {
    return await this.adRepository.findAll(query, userData);
  }

  public async findOne(adId: AdID, userData: IUserData): Promise<AdEntity> {
    const result = await this.adRepository.getById(adId, userData);
    console.log(result.favourites);
    return result;
  }

  public async findMy(userData: IUserData): Promise<[AdEntity[], number]> {
    return await this.adRepository.getByUser(userData);
  }

  public async updateMy(
    userData: IUserData,
    adId: AdID,
    dto: UpdateAdReqDto,
  ): Promise<AdEntity> {
    const ad = await this.adRepository.getById(adId, userData);
    if (ad.user_id !== userData.userId) {
      throw new BadRequestException('You cant edit this ad');
    }
    if (ProfanityFilter.containsBannedWords(dto.description.toString())) {
      this.adRepository.merge(ad, { editAttempts: ad.editAttempts + 1 });
      await this.adRepository.save(ad);
      throw new BadRequestException(
        'Your post contains profanity. Please, be gentle and do not violate our rules.',
      );
    }
    if (ad.editAttempts >= 3) {
      this.adRepository.merge(ad, { status: AdStatus.INACTIVE });
      await this.adRepository.save(ad);
      throw new BadRequestException(
        'You violated rules too many time. Manager will decide your faith.',
      );
    }

    this.adRepository.merge(ad, dto);
    return await this.adRepository.save(ad);
  }

  private async createBrand(brand: string): Promise<CarBrandEntity> {
    const entity = await this.brandRepository.findOneBy({ name: brand });
    if (!entity) {
      return await this.brandRepository.save(
        this.brandRepository.create({ name: brand }),
      );
    } else {
      return entity;
    }
  }

  private async createModel(model: string): Promise<CarModelEntity> {
    const entity = await this.modelRepository.findOneBy({ name: model });
    if (!entity) {
      return await this.modelRepository.save(
        this.modelRepository.create({ name: model }),
      );
    } else {
      return entity;
    }
  }

  public async addToFavourites(userData: IUserData, adId: AdID): Promise<void> {
    const ad = await this.adRepository.findOneBy({ id: adId });
    console.log(adId);
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    const favourite = await this.favouritesRepository.findOneBy({
      user_id: userData.userId,
      ad_id: adId,
    });
    if (favourite) {
      throw new ConflictException('You already added this ad to favourites');
    }
    await this.favouritesRepository.save(
      this.favouritesRepository.create({
        user_id: userData.userId,
        ad_id: adId,
      }),
    );
  }

  public async removeFromFavourites(
    userData: IUserData,
    adId: AdID,
  ): Promise<void> {
    const ad = await this.adRepository.findOneBy({ id: adId });
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    const favourite = await this.favouritesRepository.findOneBy({
      user_id: userData.userId,
      ad_id: adId,
    });
    if (!favourite) {
      throw new ConflictException(
        'You have not added this ad to favourites yet',
      );
    }
    await this.favouritesRepository.remove(favourite);
  }
}
