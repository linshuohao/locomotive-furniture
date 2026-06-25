# 贡献指南 · 代码门禁与提交规范

## 1. 本地环境

- **Node.js** 22（与 CI 一致）
- **包管理器**：npm（推荐，与 lockfile 对齐）

```bash
npm install   # 自动执行 husky prepare，安装 Git hooks
```

首次克隆仓库后务必执行 `npm install`，否则本地不会启用提交门禁。

## 2. 代码门禁

| 层级           | 触发时机            | 检查项                                                            |
| -------------- | ------------------- | ----------------------------------------------------------------- |
| **pre-commit** | `git commit`        | lint-staged：暂存区文件 ESLint + Prettier                         |
| **commit-msg** | 写入 commit message | commitlint：Conventional Commits 格式                             |
| **pre-push**   | `git push`          | `npm run check:changed`（增量 lint + typecheck + Vitest related） |
| **CI**         | push / PR           | `check` + `build:e2e` + Playwright E2E（见 CI 配置）              |

跳过 hooks（仅限紧急情况）：

```bash
git commit --no-verify -m "fix: emergency hotfix"
git push --no-verify
```

## 3. 手动校验

```bash
npm run lint          # ESLint + Prettier 检查
npm run lint:fix      # 自动修复
npm run typecheck     # TypeScript 类型检查
npm run test          # Vitest 单元测试
npm run e2e:install   # 首次安装 Playwright Chromium
npm run e2e           # E2E（build:e2e + Playwright）
npm run e2e:ui        # Playwright UI 调试模式
npm run check:changed # 增量检查（pre-push hook 默认）
npm run check         # 全量 lint + typecheck + test（推送前可选）
npm run build         # 生产构建
npm run build:e2e     # E2E 专用构建（mock commerce、关闭动效）
```

推送前建议：

```bash
npm run check && npm run build
```

## 4. 提交信息规范

采用 [Conventional Commits](https://www.conventionalcommits.org/)，由 `@commitlint/config-conventional` 校验。

### 格式

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

- **type**（必填）：见下表
- **scope**（可选）：影响范围，如 `cart`、`scroll`、`docs`
- **subject**（必填）：简短描述，使用祈使句、小写开头、不加句号

### 常用 type

| type       | 说明                     |
| ---------- | ------------------------ |
| `feat`     | 新功能                   |
| `fix`      | 缺陷修复                 |
| `docs`     | 仅文档变更               |
| `style`    | 代码格式（不影响逻辑）   |
| `refactor` | 重构（非新功能、非修复） |
| `perf`     | 性能优化                 |
| `test`     | 测试相关                 |
| `build`    | 构建系统或外部依赖       |
| `ci`       | CI 配置与脚本            |
| `chore`    | 其他杂项（不影响 src）   |
| `revert`   | 回滚提交                 |

### 示例

```bash
git commit -m "feat(cart): add quantity stepper on cart page"
git commit -m "fix(scroll): prevent double init on route change"
git commit -m "docs: add contributing guide for commit conventions"
git commit -m "ci: run typecheck in GitHub Actions"
```

### 错误示例

```bash
# ❌ 缺少 type
git commit -m "update cart"

# ❌ subject 以句号结尾
git commit -m "fix: resolve bug."

# ❌ 不符合 conventional 格式
git commit -m "Fixed the scroll bug"
```

## 5. 代码风格

- **ESLint**：`eslint.config.js`，覆盖 `src/**/*.ts`、`src/**/*.vue`
- **Prettier**：`.prettierrc`（单引号、无分号、printWidth 100）
- **EditorConfig**：`.editorconfig`（2 空格、LF、UTF-8）

提交时 lint-staged 会对暂存的 `.ts` / `.vue` 自动 eslint --fix + prettier --write。

## 6. GitHub Flow 分支管理

本项目采用 [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)：仅维护一条长期分支 `main`，所有变更通过短期功能分支 + Pull Request 合并。

### 6.1 流程概览

```
main (可部署) ──► feat/xxx ──► PR ──► CI ──► Review ──► Squash merge ──► main ──► Vercel Production
                              └── Preview 部署（PR 阶段）
```

### 6.2 操作步骤

```bash
# 1. 同步主干
git checkout main
git pull origin main

# 2. 创建功能分支（命名见 6.3）
git checkout -b feat/cart-stepper

# 3. 小步提交（Conventional Commits）
git add .
git commit -m "feat(cart): add quantity stepper"

# 4. 推送并开 PR
git push -u origin HEAD
gh pr create --base main

# 5. CI 通过后 Squash merge，删除远程分支
gh pr merge --squash --delete-branch
```

### 6.3 分支命名

格式：`<type>/<short-description>`

| type       | 用途     |
| ---------- | -------- |
| `feat`     | 新功能   |
| `fix`      | 缺陷修复 |
| `docs`     | 文档     |
| `refactor` | 重构     |
| `perf`     | 性能     |
| `test`     | 测试     |
| `ci`       | CI 配置  |
| `chore`    | 杂项     |

示例：`feat/i18n-routes`、`fix/scroll-double-init`、`docs/github-flow`

### 6.4 PR 要求

- 目标分支：`main`
- 使用 `.github/pull_request_template.md` 模板
- CI 须全部通过：lint → typecheck → test → build（`build` check）
- 推荐 **Squash merge**，保持 `main` 历史清晰
- 建议为 `main` 启用分支保护（见 6.6），禁止直接 push 功能代码

### 6.5 部署关联

| 事件          | 主站       | 文档       |
| ------------- | ---------- | ---------- |
| PR 打开/更新  | Preview    | Preview    |
| 合并到 `main` | Production | Production |

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 6.6 分支保护（仓库管理员）

在 GitHub 仓库 **Settings → Branches → Branch protection rules** 为 `main` 启用：

- Require a pull request before merging
- Require status checks to pass：`build`（CI workflow）
- Do not allow bypassing the above settings
- 禁止 force push

或使用 CLI（需 `repo` 权限）：

```bash
gh api --method PUT repos/linshuohao/locomotive-furniture/branches/main/protection \
  -f required_status_checks='{"strict":true,"checks":[{"context":"build"}]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":0,"dismiss_stale_reviews":true}' \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

## 7. 相关文件

| 文件                           | 说明                                                    |
| ------------------------------ | ------------------------------------------------------- |
| `.husky/pre-commit`            | 暂存区 lint-staged                                      |
| `.husky/commit-msg`            | commitlint 校验                                         |
| `.husky/pre-push`              | 增量 `check:changed`（配置/依赖变更时回退全量 `check`） |
| `scripts/check-changed.mjs`    | 增量门禁脚本                                            |
| `commitlint.config.js`         | 提交规范配置                                            |
| `.github/workflows/ci.yml`     | 远程 CI 门禁                                            |
| `package.json` → `lint-staged` | 暂存文件规则                                            |
