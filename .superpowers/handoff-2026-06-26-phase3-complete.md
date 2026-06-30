# ProzentRechner 会话交接提示词

> 生成时间：2026-06-26 10:40
> 用途：将本文件内容作为新对话的 user prompt 粘贴给 Kimi Code CLI，即可继续执行剩余任务。

---

## 角色与目标

你是 Kimi Code CLI，负责继续执行 ProzentRechner 实施计划。

项目目标：构建一个德语百分比计算器网站（Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + next-intl + KaTeX + Vitest + Playwright + Lighthouse CI）。

工作目录：`d:/Projects/Prozentrechner/.worktrees/implementation`（git worktree，分支 `feature/implementation`）。主仓库在 `d:/Projects/Prozentrechner`，**禁止在主目录操作**。

---

## 已完成任务（按提交顺序）

| Task | Commit | 说明 |
|---|---|---|
| 遗留修改 | `cc3dd28` | self-host 字体本地版、条件 static export、清理默认页 |
| Task 14 | `e40b8dc` | Prozentsatz 计算 |
| Task 15 | `ec24a9c` | Grundwert 计算 |
| Task 16 | `ad45d2d` | Prozentuale Veränderung 计算 |
| Task 17 | `8c21602` | Rabatt 计算（含 Endpreis 次要结果） |
| Task 18 | `0aa7423` | Mehrwertsteuer 计算（19%/7% 用例、负数校验） |
| Task 19 | `608c0fa` | Ab-/Zunahme 计算 |
| Task 20 | `4848546` | 7 种计算模式 registry |
| Task 21 | `d3896af` | 基于 localStorage 的每模式历史记录（FIFO 20 条） |
| Task 22 | `343fde6` | `NumberInput` 组件 |
| Task 23 | `f1d6a69` | KaTeX 公式渲染器 `FormulaBlock` |
| Task 24 | `0e06c58` | `ExplanationPanel` 组件 |
| Task 25 | `9e0ccce` | `ResultField` 组件（含复制功能） |
| Task 26 | `2f70905` | `HistoryDrawer` 组件（跨标签同步） |
| Task 27 | `dae4b31` | `CalculatorCard` 外壳 + `useDebounce` |
| Task 28 | `a4441ac` | URL hash 同步 hook `useUrlHash` |
| Task 29 | `1d320d5` | `CalculatorClient` 包装组件 |
| Task 30 | `bbf67dc` | Schema.org JSON-LD helpers |
| Task 31 | `3d26ff9` | `/de/prozentwert/` 页面 |
| Task 32 | `7dd0126` | `/de/rabatt-berechnen/` 页面 |
| Task 33 | `72233d5` | `/de/mehrwertsteuer/` 页面 + 税率选择器 |

当前 HEAD：`72233d5`。

---

## 必读文档

执行前必须通读：

1. 实施计划：`docs/superpowers/plans/2026-06-22-prozentrechner-implementation.md`
2. 设计规范：`docs/superpowers/specs/2026-06-10-prozentrechner-design.md`
3. 竞品研究：`prozentrechner-net-research.md`
4. 视觉分析：`DESIGN-cal.md`
5. 本交接文件：`.superpowers/handoff-2026-06-26-phase3-complete.md`

---

## 关键已知问题与工程决策

### 网络限制
环境无法稳定访问 `ui.shadcn.com` 和 Google Fonts。因此：
- shadcn/ui 组件为手动安装依赖 + 手写实现。
- 字体已由 `next/font/google` 改为 `next/font/local`，字体文件来自 npm 包 `@fontsource-variable/inter` 和 `@fontsource-variable/jetbrains-mono`，复制到 `app/fonts/`。

### next-intl 版本偏差
当前安装的是 `next-intl@4.13.0`（不是计划示例的 v3）。已做调整：
- 移除了 `unstable_setRequestLocale`（v4 已不存在）。
- 在 `next.config.js` 中使用了 `withNextIntl('./i18n.ts')` 插件。
- `i18n.ts` 返回对象包含 `locale` 字段，并对静态导出做了 `locale ?? defaultLocale` fallback。

### static export 与 dev server / middleware 冲突
已采用 `NEXT_BUILD=1` 环境变量方案：
- `package.json build script`: `"build": "cross-env NEXT_BUILD=1 next build"`
- `next.config.js` 仅在 `NEXT_BUILD=1` 时启用 `output: 'export'` 和 `trailingSlash: true`
- dev 模式 / Playwright 不启用 static export，避免 "Middleware cannot be used with output: export" 错误

### 本地代理问题
环境设置了 `HTTP_PROXY=http://127.0.0.1:10090` 和 `HTTPS_PROXY=...`，导致 Playwright / curl 访问 `localhost:3000` 时经代理返回 502。已验证 `curl --noproxy "*"` 可正常访问本地服务器。
- Playwright 配置中已设置 `NO_PROXY='localhost,127.0.0.1'` 并清空 `HTTP_PROXY`/`HTTPS_PROXY`。
- 若后续本地启动静态服务器遇到 502，同样需要绕过代理。

### Vitest 排除 E2E 目录
`vitest.config.ts` 中已配置 `exclude: ['tests/e2e/**', '**/node_modules/**']`，否则 `npx vitest run` 会误入 Playwright 测试。

### Windows dist/trace 文件锁
`npm run build` 曾因 `dist/trace` 被占用而失败。若下次构建再遇到 `ENOTEMPTY` / `EPERM` 错误，可尝试：
1. 用 PowerShell 查看占用进程：`Get-Process node`
2. 终止可疑的旧 node 进程
3. 重新运行 `npm run build`

### 重要实现约定（本次新增）
1. **labelKey 格式**：所有 `CalculatorMode` / `InputField` / `ResultLabel` 的 `labelKey` 使用相对 `calculator` 命名空间的路径，例如 `inputs.grundwert`、`inputs.prozentsatz`。`CalculatorCard` 通过 `useTranslations('calculator')` + `t(field.labelKey)` 解析，不要再加 `inputs.` 前缀。
2. **Server/Client 边界**：`CalculatorClient` 接收 `modeId: string`，在 client 侧通过 `modesById[modeId]` 取得完整 mode（含 `calculate` 函数）。Server 页面组件只传 mode ID 和 content。
3. **useUrlHash 稳定性**：serialize/deserialize 通过 ref 保存，避免 effect 因函数引用变化导致无限循环。
4. **MwSt. 默认税率**：`CalculatorCard` 在 `mode.id === 'mehrwertsteuer'` 且 `values.satz === null` 时自动设为 19。
5. **税率选择器**：`CalculatorCard` 对 `mehrwertsteuer` 单独渲染 `<select>`（19 % / 7 % / 20 % / 8,1 %），并过滤掉 `satz` 的 `NumberInput`。

---

## 当前工作树状态

```bash
$ git status --short
?? .superpowers/handoff-2026-06-25.md
?? .superpowers/handoff-2026-06-25-phase2-complete.md
?? .superpowers/handoff-2026-06-26-phase3-complete.md
?? test-results/
```

`test-results/` 是 Playwright 产物，不应提交。所有 `handoff-*.md` 是交接文件，不应提交。

---

## 已验证可用的命令

```bash
# 单元测试（118 passed / 18 files）
npx vitest run

# E2E 测试
npx playwright test tests/e2e/smoke.spec.ts

# 静态构建
npm run build

# 开发服务器
npm run dev
```

---

## 下一步任务（继续 Phase 4）

按实施计划继续执行，**每个任务必须 TDD（如适用）+ 独立 commit**：

### Phase 4 — Remaining Modes + Homepage
- **Task 34**: Prozentsatz / Grundwert / Prozentuale Veränderung / Ab-/Zunahme 页面
  - 34a: `content/calculators/prozentsatz.de.yaml` + `app/[locale]/prozentsatz/page.tsx`
  - 34b: `content/calculators/grundwert.de.yaml` + `app/[locale]/grundwert/page.tsx`
  - 34c: `content/calculators/prozentuale-veraenderung.de.yaml` + `app/[locale]/prozentuale-veraenderung/page.tsx`
  - 34d: `content/calculators/abzunahme.de.yaml` + `app/[locale]/abzunahme/page.tsx`
- **Task 35**: `TopNav` 组件
- **Task 36**: `Footer` 组件
- **Task 37**: `Breadcrumb` 组件
- **Task 38**: 在 `app/[locale]/layout.tsx` 中接入 TopNav + Footer
- **Task 39**: `RelatedCalculators` 组件
- **Task 40**: `FAQBand` 组件
- **Task 41**: `Quiz` 组件 + 测试
- **Task 42**: 扩展 `CalculatorClient`，加入 education / related / FAQ / quiz bands
- **Task 43**: `UniversalCalculator` 首页组件
- **Task 44**: 首页 `/de/`

### Phase 5–6
- **Task 45–50**: Content files, print styles, legal pages, SEO
- **Task 51–56**: CMP, GA4, analytics, performance/a11y, Vercel
- **Task 57**: Final QA

---

## 全局约束（必须遵守）

- 严格遵循已批准的设计文档，不引入未决策的新技术栈。
- 所有文案/内容必须走 next-intl，即使 MVP 只有德语。
- 计算核心必须 TDD：先写测试 → 看到失败 → 实现 → 看到通过 → 提交。
- 不修改 `prototypes/` 中任何文件。
- 保持代码可测试、可访问（a11y）、SEO 友好。
- 每个任务完成后必须 `git commit`，commit message 清晰。
- 文件路径必须与计划中的精确路径一致。
- 禁止在代码或计划中使用 TBD/TODO/"稍后实现"。
- 执行模式：Subagent-Driven Development，每个任务启动新鲜子 agent，父 agent review 输出并验证关键文件/测试结果后再进入下一任务。

---

## 提醒

- 本交接文件本身不要作为实现文件修改；只作为新对话的输入上下文。
- 继续任务前，先检查工作树状态：`git status --short`。
- 若子 agent 修改了非本任务文件，父 agent 必须审查并必要时 revert，保持每个 commit 原子化。
- 新页面需添加 `generateStaticParams()` 返回 `locales.map((locale) => ({ locale }))`，否则 static export 会报错。
- 税率选择器之外的模式页面可直接复用 Prozentwert/Rabatt/Mehrwertsteuer 页面的模板结构。
