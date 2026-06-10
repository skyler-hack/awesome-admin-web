import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Put,
  Query,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { UpdateUserStatusDTO, UserListQueryDTO } from '../dto/auth.dto';
import { IJwtPayload } from '../interface';
import { UserStatus } from '../constant/user.constant';
import { AuthError } from '../error/auth.error';

@Controller('/api/users', {
  middleware: ['authMiddleware', 'adminMiddleware'],
})
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/')
  async list(@Query() query: UserListQueryDTO) {
    const data = await this.userService.listUsers(query);
    return { success: true, message: 'OK', data };
  }

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new AuthError('用户不存在', 404);
    }
    return {
      success: true,
      message: 'OK',
      data: this.userService.toProfile(user),
    };
  }

  @Put('/:id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateUserStatusDTO
  ) {
    const profile = await this.userService.updateStatus(
      id,
      dto.status as UserStatus
    );
    return { success: true, message: '状态更新成功', data: profile };
  }

  @Del('/:id')
  async remove(@Param('id') id: number) {
    const currentUser = this.ctx.state.user as IJwtPayload;
    await this.userService.deleteUser(id, currentUser.userId);
    return { success: true, message: '删除成功', data: null };
  }
}
