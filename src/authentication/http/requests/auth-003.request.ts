import { IsString, IsDefined } from 'class-validator';
import { SecurityContextDto } from '@http/authentication/dtos/security-context.dto';

export class Auth003Request {
  @IsDefined()
  @IsString()
  refreshToken: string;

  securityContext: SecurityContextDto;

  user: { id: string; firstname: string; lastname: string };
}
