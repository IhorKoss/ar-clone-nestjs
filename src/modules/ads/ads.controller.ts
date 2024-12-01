import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AdID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { ManagerRequired } from '../users/decorators/roles.decorator';
import { RolesGuard } from '../users/guards/roles.guard';
import { CreateAdReqDto } from './dto/req/create-ad.req.dto';
import { ListAdQueryDto } from './dto/req/list-ad-query.req.dto';
import { UpdateAdReqDto } from './dto/req/update-ad.req.dto';
import { AdListResDto } from './dto/res/ad-list.res.dto';
import { BaseAdResDto } from './dto/res/base-ad.res.dto';
import { AdsManagerService } from './services/ads.manager.service';
import { AdsMapper } from './services/ads.mapper';
import { AdsService } from './services/ads.service';

@ApiTags('Ads')
@ApiBearerAuth()
@Controller('ads')
export class AdsController {
  constructor(
    private readonly adsService: AdsService,
    private readonly managerService: AdsManagerService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateAdReqDto,
  ): Promise<BaseAdResDto> {
    const result = await this.adsService.create(userData, dto);
    return AdsMapper.toResDto(result);
  }

  @Get()
  public async findAll(
    @CurrentUser() userData: IUserData,
    @Query() query: ListAdQueryDto,
  ): Promise<AdListResDto> {
    const [entities, total] = await this.adsService.findAll(userData, query);
    return AdsMapper.toResDtoList(entities, total, query);
  }

  @ManagerRequired()
  @Get('get-inactive')
  public async findInactive(): Promise<AdListResDto> {
    const [entities, total] = await this.managerService.findInactive();
    return AdsMapper.toResDtoList(entities, total);
  }

  @Get('my')
  public async findMy(
    @CurrentUser() userData: IUserData,
  ): Promise<AdListResDto> {
    const [entities, total] = await this.adsService.findMy(userData);
    return AdsMapper.toResDtoList(entities, total);
  }

  @Patch(':articleId')
  public async updateMy(
    @CurrentUser() userData: IUserData,
    @Param('articleId', ParseUUIDPipe) adId: AdID,
    @Body() updateAdDto: UpdateAdReqDto,
  ): Promise<BaseAdResDto> {
    const result = await this.adsService.updateMy(userData, adId, updateAdDto);
    return AdsMapper.toResDto(result);
  }

  @Get(':articleId')
  public async findOne(
    @Param('articleId', ParseUUIDPipe) adId: AdID,
  ): Promise<BaseAdResDto> {
    const result = await this.adsService.findOne(adId);
    return AdsMapper.toResDto(result);
  }

  @ManagerRequired()
  @Delete(':articleId')
  public async deleteAd(
    @Param('articleId', ParseUUIDPipe) adId: AdID,
  ): Promise<string> {
    return await this.managerService.deleteAd(adId);
  }
}
