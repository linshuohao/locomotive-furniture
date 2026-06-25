# 贡献指南 · 代码门禁与提交规范

## 1. 本地环境

```bash
npm install   # 自动执行 husky prepare，安装 Git hooks
```

首次克隆仓库后务必执行 `npm install`，否则本地不会启用提交门禁。

## 2. 代码门禁（三层）

| 层级           | 触发时机            | 检查项                                                |
| -------------- | ------------------- | ----------------------------------------------------- |
| **pre-commit** | `git commit`        | lint-staged：暂存区文件 ESLint + Prettier             |
| **commit-msg** | 写入 commit message | commitlint：Conventional Commits 格式                 |
| **pre-push**   | `git push`          | `npm run check`（lint + typecheck + test）            |
| **CI**         | push / PR           | 同 `check` + `build`（见 `.github/workflows/ci.yml`） |

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
npm run check         # lint + typecheck + test（推送前门禁）
npm run build         # 生产构建（CI 额外执行）
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

## 6. 分支与 PR

- 功能分支从 `main`（或 `master`）切出
- PR 使用 `.github/pull_request_template.md` 模板
- 合并前 CI 须全部通过：lint → typecheck → test → build

## 7. 相关文件

| 文件                           | 说明               |
| ------------------------------ | ------------------ |
| `.husky/pre-commit`            | 暂存区 lint-staged |
| `.husky/commit-msg`            | commitlint 校验    |
| `.husky/pre-push`              | 完整 check         |
| `commitlint.config.js`         | 提交规范配置       |
| `.github/workflows/ci.yml`     | 远程 CI 门禁       |
| `package.json` → `lint-staged` | 暂存文件规则       |
