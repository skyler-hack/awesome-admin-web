import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import {
  ChangePasswordDTO,
  LoginDTO,
  RegisterDTO,
  UpdateProfileDTO,
} from '../dto/auth.dto';
import { AuthError } from '../error/auth.error';
import { IJwtPayload } from '../interface';

@Controller('/api/auth')
export class AuthController {
  @Inject()
  ctx: Context;

  @Inject()
  authService: AuthService;

  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() dto: RegisterDTO) {
    const result = await this.authService.register(dto);
    return { success: true, message: '注册成功', data: result };
  }

  @Post('/login')
  async login(@Body() dto: LoginDTO) {
    const result = await this.authService.login(dto);
    return { success: true, message: '登录成功', data: result };
  }

  @Get('/profile', { middleware: ['authMiddleware'] })
  async profile() {
    const currentUser = this.ctx.state.user as IJwtPayload;
    const user = await this.userService.findById(currentUser.userId);
    if (!user) {
      throw new AuthError('用户不存在', 404);
    }
    return {
      success: true,
      message: 'OK',
      data: this.userService.toProfile(user),
    };
  }

  @Put('/profile', { middleware: ['authMiddleware'] })
  async updateProfile(@Body() dto: UpdateProfileDTO) {
    const currentUser = this.ctx.state.user as IJwtPayload;
    const profile = await this.userService.updateProfile(
      currentUser.userId,
      dto
    );
    return { success: true, message: '更新成功', data: profile };
  }

  @Put('/password', { middleware: ['authMiddleware'] })
  async changePassword(@Body() dto: ChangePasswordDTO) {
    const currentUser = this.ctx.state.user as IJwtPayload;
    await this.userService.changePassword(
      currentUser.userId,
      dto.oldPassword,
      dto.newPassword
    );
    return { success: true, message: '密码修改成功', data: null };
  }
}
