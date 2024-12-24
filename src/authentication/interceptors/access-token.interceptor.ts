import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenFactory } from '@http/authentication/factories/token.factory';
import * as process from 'node:process';
import { UserContextDto } from 'apps/users/src/user-contexts/dtos/user-context.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
  static EXPIRE_1_HOURS = '1h';
  static JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET ?? 'some-secret';

  constructor(private readonly configService: ConfigService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(async (data: any) => {
        const userContext: UserContextDto = request.userContext;
        const masqueradeUserContext: UserContextDto | undefined =
          request.masqueradeUserContext;

        if (userContext) {
          const additionalClaims = { customClaim: data.customClaim };

          const accessToken = TokenFactory.generateToken(
            userContext,
            AccessTokenInterceptor.JWT_TOKEN_SECRET,
            AccessTokenInterceptor.EXPIRE_1_HOURS,
            additionalClaims,
            masqueradeUserContext,
          );

          response.setHeader('accessToken', accessToken);

          return { ...data, accessToken };
        }

        return data;
      }),
    );
  }
}
