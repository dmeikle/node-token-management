import { SystemError } from '@mvc/exceptions/system.error';
import { Constants } from '../config/constants';

export class TokenExpiredError extends SystemError {
  constructor() {
    super(
      'Token is expired',
      Constants.TOKEN_EXPIRED_NUMBER,
      '',
      'authentication#token-expired',
    );
  }
}
