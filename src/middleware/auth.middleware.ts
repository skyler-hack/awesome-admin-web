import { Inject, Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { AuthError } from '../error/auth.error';
import { IJwtPayload } from '../interface';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwtService: JwtService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const authorization = ctx.get('authorization');
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new AuthError('未登录或 token 无效');
      }

      const token = authorization.slice(7);
      try {
        const payload = (await this.jwtService.verify(
          token
        )) as unknown as IJwtPayload;
        ctx.state.user = payload;
      } catch {
        throw new AuthError('token 已过期或无效');
      }

      return next();
    };
  }

  static getName(): string {
    return 'auth';
  }
}
