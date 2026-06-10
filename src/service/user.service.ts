import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../entity/user.entity';
import { UserRole, UserStatus } from '../constant/user.constant';
import { AuthError } from '../error/auth.error';
import { IUserProfile } from '../interface';
import {
  CreateUserDTO,
  UpdateProfileDTO,
  UserListQueryDTO,
} from '../dto/auth.dto';

@Provide()
export class UserService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Init()
  async init() {
    await this.ensureDefaultAdmin();
  }

  async ensureDefaultAdmin() {
    const count = await this.userModel.count();
    if (count > 0) {
      return;
    }
    const passwordHash = await bcrypt.hash('admin123', 10);
    await this.userModel.save({
      username: 'admin',
      password: passwordHash,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
  }

  toProfile(user: UserEntity): IUserProfile {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userModel.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userModel
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  async getUser(options: { uid: number }) {
    const user = await this.findById(options.uid);
    if (!user) {
      return null;
    }
    return this.toProfile(user);
  }

  async register(dto: CreateUserDTO): Promise<IUserProfile> {
    const exists = await this.userModel.findOne({
      where: { username: dto.username },
    });
    if (exists) {
      throw new AuthError('用户名已存在', 400);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.save({
      username: dto.username,
      password: passwordHash,
      email: dto.email || null,
      phone: dto.phone || null,
      role: dto.role || UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    return this.toProfile(user);
  }

  async updateProfile(userId: number, dto: UpdateProfileDTO): Promise<IUserProfile> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AuthError('用户不存在', 404);
    }

    if (dto.email !== undefined) {
      user.email = dto.email || null;
    }
    if (dto.phone !== undefined) {
      user.phone = dto.phone || null;
    }

    const saved = await this.userModel.save(user);
    return this.toProfile(saved);
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userModel
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new AuthError('用户不存在', 404);
    }

    const matched = await bcrypt.compare(oldPassword, user.password);
    if (!matched) {
      throw new AuthError('原密码错误', 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userModel.save(user);
  }

  async listUsers(query: UserListQueryDTO) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const keyword = query.keyword?.trim();

    const where = keyword
      ? [
          { username: Like(`%${keyword}%`) },
          { email: Like(`%${keyword}%`) },
          { phone: Like(`%${keyword}%`) },
        ]
      : undefined;

    const [list, total] = await this.userModel.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      list: list.map(item => this.toProfile(item)),
      total,
      page,
      pageSize,
    };
  }

  async updateStatus(userId: number, status: UserStatus): Promise<IUserProfile> {
    const user = await this.findById(userId);
    if (!user) {
      throw new AuthError('用户不存在', 404);
    }

    user.status = status;
    const saved = await this.userModel.save(user);
    return this.toProfile(saved);
  }

  async deleteUser(userId: number, operatorId: number): Promise<void> {
    if (userId === operatorId) {
      throw new AuthError('不能删除当前登录账号', 400);
    }

    const user = await this.findById(userId);
    if (!user) {
      throw new AuthError('用户不存在', 404);
    }

    await this.userModel.delete(userId);
  }
}
