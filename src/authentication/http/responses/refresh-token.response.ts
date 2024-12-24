import { RefreshTokenDto } from '@http/authentication/dtos/refresh-token.dto';
import { HttpResponse } from '@mvc/http/responses/http.response';

export class RefreshTokenResponse extends HttpResponse {
  constructor(data: RefreshTokenDto, details?: object) {
    super(data, 'RefreshTokenResponse', data.id, details);
  }
}
