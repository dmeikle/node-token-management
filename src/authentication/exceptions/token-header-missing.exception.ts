import { SystemError } from '@mvc/exceptions/system.error';
import { HttpStatus } from '@nestjs/common';

export class TokenHeaderMissingException extends SystemError {
  constructor() {
    super('Token header is missing', HttpStatus.UNAUTHORIZED);
  }
}
