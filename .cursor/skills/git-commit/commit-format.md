# Git Commit 消息格式

## 结构

```
<type>(<scope>): <简短描述，祈使句，≤72 字符>

[可选正文：说明动机、影响范围、破坏性变更]

[可选脚注]
```

## 类型（type）

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新增功能 | `feat(auth): add user registration` |
| fix | Bug 修复 | `fix(login): reject disabled accounts` |
| refactor | 重构，不改行为 | `refactor(user): extract password hashing` |
| perf | 性能优化 | `perf(list): add pagination query` |
| style | 格式/样式（非 UI） | `style: fix lint warnings` |
| docs | 文档 | `docs: update API auth section` |
| test | 测试 | `test(auth): add login integration tests` |
| build | 构建/打包 | `build: upgrade typeorm` |
| chore | 杂项 | `chore: rename package to awesome-admin-web` |

## scope

- 功能模块：`auth`、`user`、`config`
- 项目名：`awesome-admin-web`
- 可省略：小改动可用 `chore: update dependencies`

## 描述规则

- 使用祈使句：「add」而非「added」「adds」
- 首字母小写（英文时）
- 不加句号结尾
- 正文说明 **为什么**，不只罗列 **做了什么**

## 示例

**功能提交：**

```
feat(auth): implement JWT-based authentication

Add register/login endpoints, bcrypt password storage,
and admin/user role middleware.
```

**修复提交：**

```
fix(user): prevent admin from deleting own account

Return 403 when adminId matches target user id.
```

**文档提交：**

```
docs: switch database guide from SQLite to MySQL

Document MYSQL_* env vars and unittest SQLite fallback.
```

**依赖/配置：**

```
chore: rename package to awesome-admin-web
```
