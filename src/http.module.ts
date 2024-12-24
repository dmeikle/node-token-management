import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { RefreshTokensDbService } from '@http/authentication/data/refresh-tokens-db.service';
import { RefreshTokensHandler } from '@http/authentication/handlers/refresh-tokens.handler';

@Module({
  providers: [HttpService, RefreshTokensDbService, RefreshTokensHandler],
  exports: [HttpService, RefreshTokensDbService, RefreshTokensHandler],
})
export class HttpModule {}
