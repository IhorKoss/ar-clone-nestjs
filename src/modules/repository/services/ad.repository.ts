import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdID, UserID } from '../../../common/types/entity-ids.type';
import { AdEntity, AdStatus } from '../../../database/entities/ad.entity';
import { ListAdQueryDto } from '../../ads/dto/req/list-ad-query.req.dto';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';

@Injectable()
export class AdRepository extends Repository<AdEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdEntity, dataSource.manager);
  }

  public async findAll(
    query: ListAdQueryDto,
    userData: IUserData,
  ): Promise<[AdEntity[], number]> {
    const qb = this.createQueryBuilder('ad');
    qb.leftJoinAndSelect('ad.user', 'user');
    qb.leftJoinAndSelect('ad.brand', 'brand');
    qb.leftJoinAndSelect('ad.model', 'model');
    qb.leftJoinAndSelect(
      'ad.favourites',
      'favourite',
      'favourite.user_id = :userId',
    );
    qb.setParameter('userId', userData.userId);

    qb.andWhere('ad.status != :status', { status: AdStatus.INACTIVE });
    if (query.search) {
      qb.andWhere('CONCAT(ad.title, ad.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    if (query.brand) {
      qb.andWhere('brand.name = :brand', { brand: query.brand });
    }
    if (query.model) {
      qb.andWhere('model.name = :model', { model: query.model });
    }
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async findInactive(): Promise<[AdEntity[], number]> {
    const qb = this.createQueryBuilder('ad');
    qb.leftJoinAndSelect('ad.user', 'user');
    qb.leftJoinAndSelect('ad.brand', 'brand');
    qb.leftJoinAndSelect('ad.model', 'model');
    qb.andWhere('ad.status = :status', { status: AdStatus.INACTIVE });
    return await qb.getManyAndCount();
  }
  public async getById(adId: AdID, userData: IUserData): Promise<AdEntity> {
    const qb = this.createQueryBuilder('ad');
    qb.leftJoinAndSelect(
      'ad.favourites',
      'favourite',
      'favourite.user_id = :userId',
    );
    qb.setParameter('userId', userData.userId);
    qb.leftJoinAndSelect('ad.user', 'user');
    qb.leftJoinAndSelect('ad.brand', 'brand');
    qb.leftJoinAndSelect('ad.model', 'model');
    qb.where('ad.id = :adId', { adId });
    return await qb.getOne();
  }

  public async getByUser(userData: IUserData): Promise<[AdEntity[], number]> {
    const qb = this.createQueryBuilder('ad');
    qb.leftJoinAndSelect('ad.user', 'user');
    qb.leftJoinAndSelect('ad.brand', 'brand');
    qb.leftJoinAndSelect('ad.model', 'model');
    const userId = userData.userId;
    qb.where('user.id = :userId', { userId });

    return await qb.getManyAndCount();
  }
}
