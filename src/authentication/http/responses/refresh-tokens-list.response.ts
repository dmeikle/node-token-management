import { RefreshTokenDto } from '@http/authentication/dtos/refresh-token.dto';
import { ListResponse } from '@mvc/http/responses/list-response';
import { ListResultset } from '@mvc/data/list-resultset';

export class RefreshTokensListResponse extends ListResponse {
  constructor(list: ListResultset<RefreshTokenDto>) {
    super(list, 'RefreshTokensListResponse');
  }
}
