import { PickType } from '@nestjs/swagger';

import { BaseAdReqDto } from './base-ad.req.dto';

export class CreateAdReqDto extends PickType(BaseAdReqDto, [
  'title',
  'description',
  'phone',
  'brand',
  'model',
  'price',
  'currency',
]) {}
