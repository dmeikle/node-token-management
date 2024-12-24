import { Injectable } from '@nestjs/common';
import { BaseDbService } from '@mvc/data/base-db.service';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenNotFoundError } from '../exceptions/refresh-token-not-found.error';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma';

@Injectable()
export class RefreshTokensDbService extends BaseDbService<
  Prisma.RefreshTokensDelegate,
  RefreshTokenDto
> {
  constructor(prisma: PrismaService) {
    super(RefreshTokenDto, prisma.refreshTokens, true, true, false);
  }

  throw404(id: string): Error {
    throw new RefreshTokenNotFoundError(id);
  }
}
