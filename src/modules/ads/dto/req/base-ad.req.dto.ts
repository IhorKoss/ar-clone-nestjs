import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

import { AdCurrency, AdStatus } from '../../../../database/entities/ad.entity';

export class ConvertedPricesDto {
  @IsNumber()
  usd: number;

  @IsNumber()
  eur: number;

  @IsNumber()
  uah: number;
}

export class ExchangeRatesDto {
  @IsNumber()
  usd: number;

  @IsNumber()
  eur: number;

  @IsNumber()
  uah: number;
}

export class BaseAdReqDto {
  @ApiProperty({ example: 'Audi A7 2023' })
  @Length(8, 80)
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Audi A7 3.0 TSI in perfect condition. Black. From a dealer. No crash or smth.',
  })
  @Length(20, 1000)
  @IsString()
  description: string;

  @ApiProperty({ example: '+380501234567' })
  @Matches(/^(?:.{10}|.{13})$/, {
    message: 'Please enter a valid phone number (short or full format)',
  })
  @IsString()
  phone: string;

  @ApiProperty({ example: 28700 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 'usd',
    enum: AdCurrency,
  })
  @IsEnum(AdCurrency)
  @IsString()
  currency: AdCurrency;

  @IsObject()
  @ValidateNested()
  @Type(() => ConvertedPricesDto)
  convertedPrices: ConvertedPricesDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ExchangeRatesDto)
  exchangeRates: ExchangeRatesDto;

  @ApiProperty({ example: 'Audi' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'A7' })
  @IsString()
  model: string;

  @IsOptional()
  @IsEnum(AdStatus)
  status: AdStatus;
}
