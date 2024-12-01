import { Injectable } from '@nestjs/common';

import { AdEntity } from '../../../database/entities/ad.entity';
import { ListAdQueryDto } from '../dto/req/list-ad-query.req.dto';
import { AdListResDto } from '../dto/res/ad-list.res.dto';
import { BaseAdResDto } from '../dto/res/base-ad.res.dto';

@Injectable()
export class AdsMapper {
  public static toResDtoList(
    data: AdEntity[],
    total: number,
    query?: ListAdQueryDto,
  ): AdListResDto {
    return { data: data.map(this.toResDto), total, ...query };
  }

  public static toResDto(data: AdEntity): BaseAdResDto {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      phone: data.phone,
      price: data.price,
      convertedPrices: data.convertedPrices,
      exchangeRates: data.exchangeRates,
      currency: data.currency,
      brand: data.brand.name,
      model: data.model.name,
      created: data.created,
      updated: data.updated,
      status: data.status,
      isInFavourites: !!data.favourites?.length,
      user_id: data.user.id,
      editAttempts: data.editAttempts,
    };
  }
}
