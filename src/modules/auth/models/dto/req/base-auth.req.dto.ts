import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseUserReqDto } from '../../../../users/models/dto/req/base-user.req.dto';

export class BaseAuthReqDto extends PickType(BaseUserReqDto, [
  'name',
  'email',
  'password',
  'role',
  'accountType',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
