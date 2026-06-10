---
name: git-commit
description: 分析 git 变更并安全创建提交，遵循约定式提交格式与安全协议。在用户要求提交代码、创建 commit、git commit、帮忙提交、或 review 后提交时使用。默认仅在用户明确要求时提交，不主动提交。
---

# Git Commit

## 何时执行

- **执行**：用户明确说「提交」「commit」「创建提交」「提交代码」等
- **不执行**：任务完成但未要求提交 → 告知用户可 review 后手动提交
- **不执行**：无变更（无修改、无未跟踪文件）→ 不创建空提交

## 工作流

### Step 1：并行收集上下文

在同一轮中并行执行：

```bash
git status
git diff
git diff --staged
git log -3 --oneline
```

分析：已暂存/未暂存变更、是否含敏感文件、近期 commit 风格。

### Step 2：安全检查

**禁止提交**（若在变更中则警告并排除）：

- `.env`、`.env.*`（`.env.example` 除外）
- 密钥、credentials、`*.pem`、`*.key`
- 含 token/password 的配置文件

**禁止操作**（除非用户明确要求）：

- `git config` 修改
- `push --force`、`reset --hard`
- `--no-verify`、`--no-gpg-sign`
- 对 main/master 的 force push

**amend 仅当**全部满足：用户明确要求 amend；或 hook 改动了文件且需纳入；且 HEAD 为本会话创建、未 push。

hook 失败 → 修复后**新建 commit**，不要 amend。

### Step 3：暂存与撰写消息

1. `git add` 仅相关文件，不提交 secrets
2. 消息聚焦 **why**，1–2 句概括；类型准确（feat/fix/refactor/docs/chore 等）
3. 参考近期 `git log` 风格，保持项目一致

### Step 4：提交

使用 HEREDOC 传递消息：

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <简短描述>

<可选：说明动机或影响>
EOF
)"
```

### Step 5：验证并推送

```bash
git status
```

确认提交成功；若 hook 修改了文件，按 amend 规则处理或新建提交。

**默认推送到远程**（若已配置 `origin` 且当前分支有 upstream）：

```bash
git push origin <当前分支>
```

跳过 push 的情况：用户明确说「只 commit」「先别 push」「不要推送」。

推送后再次 `git status`，确认 `Your branch is up to date with 'origin/...'`。

## 提交消息格式

约定式提交，详见 [commit-format.md](commit-format.md)。

**快速模板**：

```
<type>(<scope>): <简短描述>

- 变更点 1
- 变更点 2
```

| type | 用途 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| refactor | 重构（无功能变化） |
| docs | 文档 |
| test | 测试 |
| chore | 依赖、配置等杂项 |

**scope**：模块或目录名（如 `auth`、`config`）；项目级改动可用 `awesome-admin-web`。

## 提交后回报

必须区分 **本地 commit** 与 **远程 push**，避免用户误以为 GitHub 已更新：

- commit hash、提交消息摘要
- push 结果：远程 URL、分支、`ahead` / `up to date` 状态
- 若 push 失败：说明原因（未登录、无权限、冲突等），不要谎称已同步
- 是否还有未提交变更

**默认行为**：`commit` 成功后自动 `push` 到 `origin`；仅用户明确要求时才只 commit 不 push。

## 示例

**用户**：「帮我把认证相关改动提交一下」

```
1. git status / diff / log
2. 确认无 .env
3. git add src/service/auth.service.ts src/controller/auth.controller.ts
4. git commit -m "$(cat <<'EOF'
feat(auth): add JWT login and profile endpoints

Implement register/login with bcrypt and role-based access control.
EOF
)"
5. git status → git push origin main
6. 回报：commit `<hash>` 已推送到 origin/main
```

**用户**：「提交，用中文描述」

消息 subject 可用中文，保持 type(scope) 前缀：

```
feat(auth): 实现 JWT 登录与用户资料接口
```
