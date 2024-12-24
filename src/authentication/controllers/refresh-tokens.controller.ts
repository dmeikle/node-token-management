import { BaseController } from '@mvc/controllers/base.controller';
import { ListResultset } from '@mvc/data/list-resultset';
import { Controller } from '@nestjs/common';
import { Auth003Request } from '../http/requests/auth-003.request';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensListResponse } from '../http/responses/refresh-tokens-list.response';
import { RefreshTokenResponse } from '../http/responses/refresh-token.response';
import { RefreshTokensHandler } from '@http/authentication/handlers/refresh-tokens.handler';

@Controller('refreshtokens')
export class RefreshTokensController extends BaseController<
  RefreshTokensHandler,
  Auth003Request,
  RefreshTokenDto,
  RefreshTokenResponse,
  RefreshTokensListResponse
> {
  getDtoConstructor(): new (request: Auth003Request) => RefreshTokenDto {
    return RefreshTokenDto;
  }
  constructor(handler: RefreshTokensHandler) {
    super(handler);
  }

  createResponseFromDto(dto: RefreshTokenDto): RefreshTokenResponse {
    return new RefreshTokenResponse(dto, {});
  }

  createResponseList(
    list: ListResultset<RefreshTokenDto>,
  ): RefreshTokensListResponse {
    return new RefreshTokensListResponse(list);
  }
}
