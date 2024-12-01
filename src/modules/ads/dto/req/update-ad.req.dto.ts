import { PickType } from '@nestjs/swagger';

import { BaseAdReqDto } from './base-ad.req.dto';

export class UpdateAdReqDto extends PickType(BaseAdReqDto, [
  'title',
  'description',
  'phone',
  'price',
  'currency',
]) {}
