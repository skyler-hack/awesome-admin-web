import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { AuthError } from '../error/auth.error';
import { UserRole } from '../constant/user.constant';
import { IJwtPayload } from '../interface';

@Middleware()
export class AdminMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const user = ctx.state.user as IJwtPayload;
      if (!user || user.role !== UserRole.ADMIN) {
        throw new AuthError('无管理员权限', 403);
      }
      return next();
    };
  }

  static getName(): string {
    return 'admin';
  }
}
