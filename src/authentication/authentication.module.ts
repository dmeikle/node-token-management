import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RefreshTokensDbService } from '@http/authentication/data/refresh-tokens-db.service';
import { RefreshTokensHandler } from '@http/authentication/handlers/refresh-tokens.handler';

@Module({
  providers: [
    AuthenticationService,
    RefreshTokensDbService,
    RefreshTokensHandler,
  ],
  exports: [
    AuthenticationService,
    RefreshTokensDbService,
    RefreshTokensHandler,
  ],
})
export class AuthenticationModule {}
