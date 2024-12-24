import * as jwt from 'jsonwebtoken';
import { SecurityContextDto } from '@http/authentication/dtos/security-context.dto';
import { TokenExpiredError } from '@http/authentication/exceptions/token-expired.error';
import { hash } from 'bcrypt';

import { RefreshTokenDto } from '@http/authentication/dtos/refresh-token.dto';
import { UserContextDto } from '../../../../../apps/users/src/user-contexts/dtos/user-context.dto';

/**
 * Token factory
 *
 */
export class TokenFactory {
  static ANONYMOUS_ROLES: Array<string> = ['IS_ANONYMOUS'];
  static ANONYMOUS_USER = 'anonymous';

  /**
   * Generate a JWT
   *
   * @param context
   * @param payload
   * @param secretKey
   * @param expiresIn
   */
  static generateToken(
    originalUserContext: UserContextDto,
    secretKey: string,
    expiresIn: string,
    additionalClaims: Record<string, any> = {},
    masqueradeUserContext?: UserContextDto,
  ): string {
    const payload = {
      originalUserId: originalUserContext.id,
      masqueradedUserId: masqueradeUserContext
        ? masqueradeUserContext.id
        : originalUserContext.id,
      roles: masqueradeUserContext
        ? masqueradeUserContext.roles
        : originalUserContext.roles,
      ...additionalClaims,
    };

    return jwt.sign(payload, secretKey, { expiresIn });
  }

  /**
   * Generate an anonymous JWT
   *
   * @param payload
   * @param secretKey
   * @param expiresIn
   */
  static generateAnonymousToken(
    payload: Record<string, any>, // Additional claims to include
    secretKey: string,
    expiresIn: string, // Time limit for token expiration
  ): string {
    // Add the user.id from UserContextDto to the payload
    const completePayload = {
      ...payload, // Spread existing payload claims
      contextId: TokenFactory.ANONYMOUS_USER,
      roles: TokenFactory.ANONYMOUS_ROLES,
    };

    // Generate the JWT token with the complete payload and expiration
    return jwt.sign(completePayload, secretKey, { expiresIn });
  }

  /**
   * Verify a token
   *
   * @param token
   * @param secret
   * @param ignoreExpiration
   */
  static verifyToken(
    token: string,
    secret: string,
    ignoreExpiration: boolean = true,
  ): SecurityContextDto {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secret) as Record<string, any>;
    if (!ignoreExpiration && this.checkTokenExpired(decoded)) {
      throw new TokenExpiredError();
    }
    // Extract claims from the decoded payload
    const originalUserId: string = decoded.originalUserId;
    const masqueradedUserId: string = decoded.masqueradedUserId;
    const roles: any = decoded.roles;

    return new SecurityContextDto(masqueradedUserId, roles, originalUserId);
  }

  /**
   * Verify a refresh token
   *
   * @param token
   * @param secret
   */
  static verifyRefreshToken(token: string, secret: string): SecurityContextDto {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secret) as Record<string, any>;
    if (this.checkTokenExpired(decoded)) {
      throw new TokenExpiredError();
    }
    // Extract claims from the decoded payload
    const originalUserId: string = decoded.contextId;

    return new SecurityContextDto(originalUserId, [], originalUserId);
  }

  /**
   * Generate a refresh token
   *
   * @param contextId
   * @param secretKey
   */
  static async generateRefreshToken(
    contextId: string,
    secretKey: string,
  ): Promise<[string, RefreshTokenDto]> {
    // Generate the refresh token
    const tokenString: string = jwt.sign({ contextId: contextId }, secretKey, {
      expiresIn: '7d',
    });

    // Hash the token before storing for security
    const hashedToken = await hash(tokenString, 10);

    // Store the token in the database
    const refreshToken: RefreshTokenDto = new RefreshTokenDto({
      userContextsId: contextId,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return [tokenString, refreshToken];
  }

  /**
   * Check if the token is expired
   *
   * @param decoded
   * @private
   */
  private static checkTokenExpired(decoded: any): boolean {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime;
  }
}
