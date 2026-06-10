import { Inject, Provide } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { LoginDTO, RegisterDTO } from '../dto/auth.dto';
import { AuthError } from '../error/auth.error';
import { IJwtPayload } from '../interface';
import { UserStatus } from '../constant/user.constant';

@Provide()
export class AuthService {
  @Inject()
  userService: UserService;

  @Inject()
  jwtService: JwtService;

  async register(dto: RegisterDTO) {
    const profile = await this.userService.register(dto);
    const token = await this.signToken({
      userId: profile.id,
      username: profile.username,
      role: profile.role,
    });
    return { user: profile, token };
  }

  async login(dto: LoginDTO) {
    const user = await this.userService.findByUsername(dto.username);
    if (!user) {
      throw new AuthError('用户名或密码错误', 400);
    }

    if (user.status === UserStatus.DISABLED) {
      throw new AuthError('账号已被禁用', 403);
    }

    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) {
      throw new AuthError('用户名或密码错误', 400);
    }

    const profile = this.userService.toProfile(user);
    const token = await this.signToken({
      userId: profile.id,
      username: profile.username,
      role: profile.role,
    });

    return { user: profile, token };
  }

  async signToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
