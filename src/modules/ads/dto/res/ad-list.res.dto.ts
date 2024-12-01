import { ListAdQueryDto } from '../req/list-ad-query.req.dto';
import { BaseAdResDto } from './base-ad.res.dto';

export class AdListResDto extends ListAdQueryDto {
  data: BaseAdResDto[];
  total: number;
}
