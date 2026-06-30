# ProzentRechner 会话交接提示词

> 生成时间：2026-06-26 16:00
> 用途：将本文件内容作为新对话的 user prompt 粘贴给 Kimi Code CLI，即可继续执行剩余任务。

---

## 角色与目标

你是 Kimi Code CLI，负责继续执行 Prozentrechner 实施计划。

项目目标：构建一个德语百分比计算器网站（Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + next-intl + KaTeX + Vitest + Playwright + Lighthouse CI）。

工作目录：`d:/Projects/Prozentrechner/.worktrees/implementation`（git worktree，分支 `feature/implementation`）。主仓库在 `d:/Projects/Prozentrechner`，**禁止在主目录操作**。

---

## 已完成任务（按提交顺序）

| Task | Commit | 说明 |
|---|---|---|
| Task 34a | `66bf4c5` | Prozentsatz 页面 + YAML |
| Task 34b | `df746e5` | Grundwert 页面 + YAML |
| Task 34c | `58a8c60` | Prozentuale Veränderung 页面 + YAML |
| Task 34d | `7194450` | Ab-/Zunahme 页面 + YAML + `calculator.inputs.abzunahme` |
| Task 35 | `19b5973` | TopNav 组件 + `lib/navigation.ts` |
| Task 36 | `192319e` | Footer 组件 + Footer i18n keys |
| Task 37 | `959ea24` | Breadcrumb 组件 |
| Task 38 | `3b3ec17` | Layout 接入 TopNav + Footer |
| Task 39 | `6a1da28` | RelatedCalculators 组件 |
| Task 40 | `a0d9feb` | FAQBand 组件 |
| Task 41 | `47e90f6` | Quiz 组件 + 测试 |
| Task 42 | `a1c90ac` | CalculatorClient 扩展：breadcrumb、step-by-step、related、education+quiz、FAQ |
| Task 43 | `200c82b` | UniversalCalculator 首页组件 + NumberInput `hideLabel` |
| Task 44 | `05cf803` | 首页 `/de/` |
| Task 45 | `4ee15ab` | 所有 content YAML 验证测试 |
| Task 46 | `0386404` | Print stylesheet（修复版：用 `.site-header`/`.site-footer`/`.explanation-panel-print` 等 class hook，避免重复 explanation panel） |
| Task 47 | `c364629` | Impressum 页面 |
| Task 48 | `3449c58` | Datenschutz 页面 |
| Task 49 | `531fa05` | 全局 hreflang/canonical metadata + `buildCanonicalUrl` helper + 修复所有页面 canonical 的 `/de/` 前缀 |
| Task 50 | `d7d2236` | robots.txt + sitemap.xml |

当前 HEAD：`d7d2236`。

---

## 必读文档

1. 实施计划：`docs/superpowers/plans/2026-06-22-prozentrechner-implementation.md`
2. 设计规范：`docs/superpowers/specs/2026-06-10-prozentrechner-design.md`
3. 竞品研究：`prozentrechner-net-research.md`
4. 视觉分析：`DESIGN-cal.md`
5. 本交接文件：`.superpowers/handoff-2026-06-26-phase5-complete.md`

---

## 关键已知问题与工程决策

- next-intl@4.13.0，已移除 unstable_setRequestLocale；i18n.ts 对静态导出做了 locale fallback。
- 静态导出由 NEXT_BUILD=1 控制，dev / Playwright 不走 export。
- 环境 HTTP_PROXY 导致 localhost 502；Playwright 已配置 NO_PROXY 绕过。
- Vitest 已排除 tests/e2e/**。
- Windows 构建时 dist/trace 可能被旧 node 进程锁定；若再遇 ENOTEMPTY/EPERM，先 Get-Process node 终止可疑旧进程再重试。
- `lib/navigation.ts` 使用 `createNavigation` 提供 locale-aware `Link`；新增 `buildCanonicalUrl(baseUrl, locale, path)` helper，所有页面 canonical、breadcrumb、sitemap 均通过它生成，确保 `/de/` 前缀一致。
- CalculatorClient 接收可选 `breadcrumbItems`；7 个模式页面 + 2 个法律页面均已传入 breadcrumb 并移除重复的 JsonLd breadcrumb schema。
- UniversalCalculator 使用 NumberInput 内联输入（`hideLabel`）；MwSt. 默认税率 19%。
- 页面 First Load JS 目前约 87–210 kB。
- robots.txt / sitemap.xml 已生成；sitemap 包含 10 个 URL，均带 `/de/` 前缀。
- Impressum / Datenschutz 使用占位符数据，需在上线前替换 `messages/de.json` 中的 `impressum.placeholders` 和 `datenschutz.placeholders`。

---

## 当前工作树状态

```bash
$ git status --short
?? .superpowers/handoff-2026-06-25-phase2-complete.md
?? .superpowers/handoff-2026-06-25.md
?? .superpowers/handoff-2026-06-26-phase3-complete.md
?? .superpowers/handoff-2026-06-26-phase4-complete.md
?? .superpowers/handoff-2026-06-26-phase5-complete.md
?? .superpowers/handoff-prompt-next-session.md
?? test-results/
```

`test-results/` 是 Playwright 产物，不应提交。所有 `handoff-*.md` 是交接文件，不应提交。

---

## 已验证可用的命令

```bash
# 单元测试（125 passed / 20 files）
npx vitest run

# E2E 测试
npx playwright test tests/e2e/smoke.spec.ts

# 静态构建
npm run build

# 开发服务器
npm run dev
```

---

## 下一步任务（继续 Phase 6）

按实施计划继续执行，**每个任务必须 TDD（如适用）+ 独立 commit**：

### Phase 6 — Pre-launch

- **Task 51**: Integrate Usercentrics CMP
  - 创建 `components/consent/usercentrics-script.tsx`
  - 在 `app/[locale]/layout.tsx` 的 `<head>` 中引入
  - Commit: `feat(consent): integrate Usercentrics CMP loader`
- **Task 52**: Integrate Google Analytics 4 with consent gate
  - 创建 `components/analytics/ga4-script.tsx`
  - 在 `app/[locale]/layout.tsx` 中引入
  - Commit: `feat(analytics): add consent-gated GA4 integration`
- **Task 53**: Add analytics event helpers
  - 创建 `lib/analytics.ts`
  - 在 ResultField copy、Quiz answer 等关键交互处触发 `sendGAEvent`
  - Commit: `feat(analytics): add GA4 event helpers and wire key interactions`
- **Task 54**: Performance optimization pass
  - Lazy-load KaTeX CSS（从 globals.css 的 `@import` 改为 layout 中的 preload link）
  - Preconnect Usercentrics domain
  - Commit: `perf: lazy-load KaTeX and preconnect CMP`
- **Task 55**: Accessibility optimization pass
  - 添加 aria-live region 用于结果更新
  - 为 FormulaBlock 添加 visually-hidden 公式描述
  - 验证焦点状态
  - Commit: `a11y: add live region and formula descriptions`
- **Task 56**: Configure Vercel deployment
  - 创建/更新 `vercel.json`
  - 配置环境变量 `NEXT_PUBLIC_GA4_ID`、`NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID`
  - Commit: `chore(deploy): configure Vercel project`
- **Task 57**: Final QA run
  - 运行完整测试套件、Lighthouse CI
  - 删除 `prototypes/` 目录
  - Commit: `chore: final QA fixes and remove prototypes`

---

## 全局约束（必须遵守）

- 严格遵循已批准的设计文档，不引入未决策的新技术栈。
- 所有文案/内容必须走 next-intl，即使 MVP 只有德语。
- 计算核心必须 TDD：先写测试 → 看到失败 → 实现 → 看到通过 → 提交。
- 不修改 `prototypes/` 中任何文件（Task 57 最终删除除外）。
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
