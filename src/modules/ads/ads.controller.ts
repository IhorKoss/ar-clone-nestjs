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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdID } from '../../common/types/entity-ids.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
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
  @ApiOperation({
    summary: 'Create ad',
    description: 'Creates a new ad. The user must be logged in to create an ad',
  })
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateAdReqDto,
  ): Promise<BaseAdResDto> {
    const result = await this.adsService.create(userData, dto);
    return AdsMapper.toResDto(result);
  }

  // @SkipAuth()
  @Get()
  @ApiOperation({
    summary: 'Get all ads',
    description: 'Finds all ads',
  })
  public async findAll(
    @Query() query: ListAdQueryDto,
    @CurrentUser() userData: IUserData,
  ): Promise<AdListResDto> {
    const [entities, total] = await this.adsService.findAll(query, userData);
    return AdsMapper.toResDtoList(entities, total, query);
  }

  @ManagerRequired()
  @Get('get-inactive')
  @ApiOperation({
    summary: 'Get all inactive ads',
    description:
      'ATTENTION: Only for managers or above. Finds all inactive ads',
  })
  public async findInactive(): Promise<AdListResDto> {
    const [entities, total] = await this.managerService.findInactive();
    return AdsMapper.toResDtoList(entities, total);
  }

  @Get('my')
  @ApiOperation({
    summary: 'Get all my ads',
    description: 'Finds all ads created by the current user',
  })
  public async findMy(
    @CurrentUser() userData: IUserData,
  ): Promise<AdListResDto> {
    const [entities, total] = await this.adsService.findMy(userData);
    return AdsMapper.toResDtoList(entities, total);
  }

  @Patch(':adId')
  @ApiOperation({
    summary: 'Update ad',
    description: 'Updates ad by ID. The user must be the owner of the ad',
  })
  public async updateMy(
    @CurrentUser() userData: IUserData,
    @Param('adId', ParseUUIDPipe) adId: AdID,
    @Body() updateAdDto: UpdateAdReqDto,
  ): Promise<BaseAdResDto> {
    const result = await this.adsService.updateMy(userData, adId, updateAdDto);
    return AdsMapper.toResDto(result);
  }

  @Get(':adId')
  @ApiOperation({
    summary: 'Get ad by ID',
    description: 'Finds ad by ID',
  })
  public async findOne(
    @Param('adId', ParseUUIDPipe) adId: AdID,
    @CurrentUser() userData: IUserData,
  ): Promise<BaseAdResDto> {
    const result = await this.adsService.findOne(adId, userData);
    return AdsMapper.toResDto(result);
  }

  @ManagerRequired()
  @Delete(':adId')
  @ApiOperation({
    summary: 'Delete inactive ad by ID',
    description:
      'ATTENTION: Only for managers or above. Deletes inactive ad by ID',
  })
  public async deleteAd(
    @CurrentUser() userData: IUserData,
    @Param('adId', ParseUUIDPipe) adId: AdID,
  ): Promise<string> {
    return await this.managerService.deleteAd(adId);
  }

  @Post(':adId/add-to-favourites')
  @ApiOperation({
    summary: 'Add ad to favourites',
    description: 'Adds ad to favourites',
  })
  public async like(
    @CurrentUser() userData: IUserData,
    @Param('adId', ParseUUIDPipe) adId: AdID,
  ): Promise<void> {
    await this.adsService.addToFavourites(userData, adId);
  }

  @Delete(':adId/remove-from-favourites')
  @ApiOperation({
    summary: 'Remove ad from favourites',
    description: 'Removes ad from favourites',
  })
  public async unlike(
    @CurrentUser() userData: IUserData,
    @Param('adId', ParseUUIDPipe) adId: AdID,
  ): Promise<void> {
    await this.adsService.removeFromFavourites(userData, adId);
  }

  @Post('easter-egg')
  @SkipAuth()
  @ApiOperation({
    summary: 'Banal easter egg',
    description: 'Sorry, but it is just a rickroll',
  })
  public async easterEgg(): Promise<string> {
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
}
