import { Injectable } from '@nestjs/common';
import { BaseHandler } from '@mvc/handlers/base.handler';
import { RefreshTokensDbService } from '@http/authentication/data/refresh-tokens-db.service';
import { RefreshTokenDto } from '@http/authentication/dtos/refresh-token.dto';

@Injectable()
export class RefreshTokensHandler extends BaseHandler<
  RefreshTokensDbService,
  RefreshTokenDto
> {
  constructor(dbService: RefreshTokensDbService) {
    super(dbService);
  }
}
