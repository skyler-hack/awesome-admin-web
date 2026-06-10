import { MidwayHttpError } from '@midwayjs/core';

export class AuthError extends MidwayHttpError {
  constructor(message: string, status = 401) {
    super(message, status);
  }
}
