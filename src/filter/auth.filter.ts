import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AuthError } from '../error/auth.error';

@Catch(AuthError)
export class AuthFilter {
  async catch(err: AuthError, ctx: Context) {
    ctx.status = err.status;
    return {
      success: false,
      message: err.message,
      data: null,
    };
  }
}
