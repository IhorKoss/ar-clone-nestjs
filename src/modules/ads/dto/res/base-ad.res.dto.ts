import { AdStatus } from '../../../../database/entities/ad.entity';

export class BaseAdResDto {
  id: string;
  title: string;
  description: string;
  phone: string;
  price: number;
  currency: string;
  convertedPrices: {
    usd: number;
    eur: number;
    uah: number;
  };
  exchangeRates: {
    usd: number;
    eur: number;
    uah: number;
  };
  created: Date;
  updated: Date;
  brand: string;
  model: string;
  status: AdStatus;
  user_id: string;
  isInFavourites: boolean;
  editAttempts: number;
}
