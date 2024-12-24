import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { mergeMap } from 'rxjs/operators';
import { TokenFactory } from '@http/authentication/factories/token.factory';
import { SecurityContextDto } from '@http/authentication/dtos/security-context.dto';
import { RefreshTokensHandler } from '@http/authentication/handlers/refresh-tokens.handler';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  static JWT_REFRESH_SECRET = 'some-refresh-secret';

  constructor(private readonly refreshTokensHandler: RefreshTokensHandler) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      mergeMap(async (data: any) => {
        // Generate a new refresh token (optional, based on request.user)
        const securityContext: SecurityContextDto = request.securityContext;
        const [refreshToken, plainRefreshToken]: any = securityContext
          ? await TokenFactory.generateRefreshToken(
              securityContext.originalContextId, //purposefully keeping originalContextId
              RefreshTokenInterceptor.JWT_REFRESH_SECRET,
            )
          : null;
        await this.refreshTokensHandler.create(
          securityContext.contextId,
          plainRefreshToken,
        );
        // Attach the refresh token as an HTTP-only cookie
        if (refreshToken) {
          response.setHeader('refreshToken', refreshToken);
        }

        return {
          ...data,
          refreshToken,
        };
      }),
    );
  }
}
