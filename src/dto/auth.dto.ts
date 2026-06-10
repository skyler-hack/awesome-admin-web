import { Rule, RuleType } from '@midwayjs/validate';
import { UserRole } from '../constant/user.constant';

export class RegisterDTO {
  @Rule(RuleType.string().required().min(3).max(50))
  username: string;

  @Rule(RuleType.string().required().min(6).max(32))
  password: string;

  @Rule(RuleType.string().email().optional().allow('', null))
  email?: string;

  @Rule(RuleType.string().pattern(/^1\d{10}$/).optional().allow('', null))
  phone?: string;
}

export class LoginDTO {
  @Rule(RuleType.string().required())
  username: string;

  @Rule(RuleType.string().required())
  password: string;
}

export class UpdateProfileDTO {
  @Rule(RuleType.string().email().optional().allow('', null))
  email?: string;

  @Rule(RuleType.string().pattern(/^1\d{10}$/).optional().allow('', null))
  phone?: string;
}

export class ChangePasswordDTO {
  @Rule(RuleType.string().required())
  oldPassword: string;

  @Rule(RuleType.string().required().min(6).max(32))
  newPassword: string;
}

export class UpdateUserStatusDTO {
  @Rule(RuleType.number().valid(0, 1).required())
  status: number;
}

export class UserListQueryDTO {
  @Rule(RuleType.number().integer().min(1).optional().default(1))
  page?: number;

  @Rule(RuleType.number().integer().min(1).max(100).optional().default(10))
  pageSize?: number;

  @Rule(RuleType.string().optional().allow(''))
  keyword?: string;
}

export class CreateUserDTO extends RegisterDTO {
  @Rule(
    RuleType.string()
      .valid(UserRole.USER, UserRole.ADMIN)
      .optional()
      .default(UserRole.USER)
  )
  role?: UserRole;
}
