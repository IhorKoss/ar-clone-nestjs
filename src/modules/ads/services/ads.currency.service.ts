import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

import { AdCurrency } from '../../../database/entities/ad.entity';
import { AdRepository } from '../../repository/services/ad.repository';
import {
  ConvertedPricesDto,
  ExchangeRatesDto,
} from '../dto/req/base-ad.req.dto';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly adRepository: AdRepository,
  ) {}
  private readonly logger = new Logger(CurrencyService.name);

  private exchangeRates: {
    uah: { buy: number; sale: number };
    usd: { buy: number | null; sale: number | null };
    eur: { buy: number | null; sale: number | null };
  } = {
    uah: { buy: 1, sale: 1 },
    usd: { buy: null, sale: null },
    eur: { buy: null, sale: null },
  };

  @Cron('0 0 * * *')
  async updateExchangeRates(): Promise<void> {
    this.logger.log('Updating exchange rates. Please wait...');
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
        ),
      );
      const rates = response.data;

      this.exchangeRates.usd.buy =
        rates.find((rate) => rate.ccy === 'USD')?.buy || null;
      this.exchangeRates.usd.sale =
        rates.find((rate) => rate.ccy === 'USD')?.sale || null;

      this.exchangeRates.eur.buy =
        rates.find((rate) => rate.ccy === 'EUR')?.buy || null;
      this.exchangeRates.eur.sale =
        rates.find((rate) => rate.ccy === 'EUR')?.sale || null;
    } catch (error) {
      this.logger.error('Failed to update exchange rates', error);
    }
  }
  @Cron('0 1 * * *')
  async updateUserAdsPrices(): Promise<void> {
    this.logger.log('Updating user ads prices. Please wait...');
    try {
      const ads = await this.adRepository.find();
      const exchangeRates = this.exchangeRates;
      for (const ad of ads) {
        const baseCurrency = ad.currency;
        const basePrice = ad.price;

        ad.convertedPrices = {
          usd: this.convertCurrency(basePrice, baseCurrency, AdCurrency.USD),
          eur: this.convertCurrency(basePrice, baseCurrency, AdCurrency.EUR),
          uah: this.convertCurrency(basePrice, baseCurrency, AdCurrency.UAH),
        };

        if (
          baseCurrency === AdCurrency.USD ||
          baseCurrency === AdCurrency.EUR
        ) {
          ad.exchangeRates = {
            usd: Number(exchangeRates.uah.sale),
            eur: Number(exchangeRates.eur.sale),
            uah: Number(exchangeRates.uah.sale),
          };
        } else {
          ad.exchangeRates = {
            usd: Number(exchangeRates.uah.buy),
            eur: Number(exchangeRates.eur.buy),
            uah: Number(exchangeRates.uah.buy),
          };
        }

        await this.adRepository.save(ad);
      }

      this.logger.log('User ads prices updated successfully.');
    } catch (error) {
      this.logger.error('Failed to update user ads prices', error);
    }
  }

  private getExchangeRates(): {
    usd: { buy: number; sale: number };
    eur: { buy: number; sale: number };
    uah: { buy: number; sale: number };
  } {
    return this.exchangeRates;
  }

  private async instantUpdateExchangeRates(): Promise<void> {
    await this.updateExchangeRates();
  }

  convertCurrency(
    amount: number,
    fromCurrency: AdCurrency,
    toCurrency: AdCurrency,
  ): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    const rates = this.exchangeRates;

    const amountInUAH = amount * rates[fromCurrency].sale;
    if (
      (fromCurrency === AdCurrency.USD && toCurrency === AdCurrency.EUR) ||
      (fromCurrency === AdCurrency.EUR && toCurrency === AdCurrency.USD)
    ) {
      const convertedAmount = amountInUAH / rates[toCurrency].sale;
      return parseFloat(convertedAmount.toFixed(2));
    }
    const convertedAmount = amountInUAH / rates[toCurrency].buy;
    return parseFloat(convertedAmount.toFixed(2));
  }

  async convertAdPrice(
    amount: number,
    priceCurrency: AdCurrency,
  ): Promise<[ConvertedPricesDto, ExchangeRatesDto]> {
    let exchangeRates = this.exchangeRates;
    if (!exchangeRates.usd.buy || !exchangeRates.eur.buy) {
      await this.instantUpdateExchangeRates();
      exchangeRates = this.getExchangeRates();
    }
    const usedExchangeRates: ExchangeRatesDto = {
      uah: null,
      usd: null,
      eur: null,
    };

    const convertedPrices: ConvertedPricesDto = {
      usd: this.convertCurrency(amount, priceCurrency, AdCurrency.USD),
      eur: this.convertCurrency(amount, priceCurrency, AdCurrency.EUR),
      uah: this.convertCurrency(amount, priceCurrency, AdCurrency.UAH),
    };

    if (priceCurrency === AdCurrency.USD || priceCurrency === AdCurrency.EUR) {
      usedExchangeRates.uah = Number(exchangeRates.uah.sale);
      usedExchangeRates.usd = Number(exchangeRates.usd.sale);
      usedExchangeRates.eur = Number(exchangeRates.eur.sale);
    } else {
      usedExchangeRates.uah = Number(exchangeRates.uah.buy);
      usedExchangeRates.usd = Number(exchangeRates.usd.buy);
      usedExchangeRates.eur = Number(exchangeRates.eur.buy);
    }
    return [convertedPrices, usedExchangeRates];
  }
}
