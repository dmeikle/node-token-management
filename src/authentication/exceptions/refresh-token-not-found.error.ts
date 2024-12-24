import { NotFoundSystemError } from '@mvc/exceptions/not-found-system.error';
import { Constants } from '../config/constants';

export class RefreshTokenNotFoundError extends NotFoundSystemError {
  constructor(id: string) {
    super(
      'No RefreshTokenNotFoundError found with id ' + id,
      Constants.REFRESH_TOKEN_NOT_FOUND_NUMBER,
      id,
      'refresh-tokens#not-found',
    );
  }
}
