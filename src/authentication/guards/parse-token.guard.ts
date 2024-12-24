import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenFactory } from '@http/authentication/factories/token.factory';
import { SecurityContextDto } from '@http/authentication/dtos/security-context.dto';
import { AnonymousSecurityContextDto } from '@http/authentication/dtos/anonymous-security-context.dto';
import { UserContextsHandler } from 'apps/users/src/user-contexts/handlers/user-contexts.handler';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { InvalidRefreshTokenException } from '@http/authentication/exceptions/invalid-refresh-token.exception';

/**
 * Parse token guard
 */
@Injectable()
export class ParseTokenGuard implements CanActivate {
  static JWT_TOKEN_SECRET = 'some-secret';
  static JWT_REFRESH_SECRET = 'some-refresh-secret';

  constructor(
    private readonly userContextsHandler: UserContextsHandler,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Check if the request is authorized
   *
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    const refreshTokenHeader = request.headers['refresh-token'];

    const token = this.extractToken(authorizationHeader);
    if (!token) {
      return await this.handleRefreshToken(context, refreshTokenHeader);
    }

    try {
      const securityContext = TokenFactory.verifyToken(
        token,
        ParseTokenGuard.JWT_TOKEN_SECRET,
      );
      await this.attachUserContext(request, securityContext.contextId);
      return true;
    } catch (error: any) {
      return await this.handleRefreshToken(context, refreshTokenHeader);
    }
  }

  /**
   * Extract token from the authorization header
   *
   * @param authorizationHeader
   * @private
   */
  private extractToken(authorizationHeader: string | undefined): string | null {
    if (authorizationHeader) {
      return authorizationHeader.split(' ')[1]; // Assuming 'Bearer <token>' format
    }
    return null;
  }

  /**
   * Attach user context to the request
   *
   * @param request
   * @param contextId
   * @private
   */
  private async attachUserContext(
    request: any,
    contextId: string,
  ): Promise<void> {
    const userContext = await this.userContextsHandler.getById(contextId);
    if (!userContext) {
      throw new UnauthorizedException('User not found');
    }
    request.securityContext = new SecurityContextDto(
      userContext.id,
      userContext.roles.split(','),
      userContext.id,
    );
    request.userContext = userContext;
  }

  private async handleRefreshToken(
    context: ExecutionContext,
    refreshToken: string | undefined,
  ): Promise<boolean> {
    if (!refreshToken) {
      context.switchToHttp().getRequest().securityContext =
        new AnonymousSecurityContextDto();
      return true;
    }

    try {
      const refreshTokenSecurityContext = TokenFactory.verifyRefreshToken(
        refreshToken,
        ParseTokenGuard.JWT_REFRESH_SECRET,
      );
      await this.attachUserContext(
        context.switchToHttp().getRequest(),
        refreshTokenSecurityContext.contextId,
      );
      return true;
    } catch (refreshError: any) {
      throw new InvalidRefreshTokenException();
    }
  }
}
