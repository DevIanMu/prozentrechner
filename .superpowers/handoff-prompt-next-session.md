# 下一段对话的初始提示词

复制以下内容，作为新对话的第一条消息发送给 Kimi Code CLI：

---

你是 Kimi Code CLI，负责继续执行 ProzentRechner 实施计划。

**项目目标：** 构建一个德语百分比计算器网站（Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + next-intl + KaTeX + Vitest + Playwright + Lighthouse CI）。

**工作目录：** `d:/Projects/Prozentrechner/.worktrees/implementation`（git worktree，分支 `feature/implementation`）。主仓库在 `d:/Projects/Prozentrechner`，**禁止在主目录操作**。

**必读文档：**
- 实施计划：`docs/superpowers/plans/2026-06-22-prozentrechner-implementation.md`
- 设计规范：`docs/superpowers/specs/2026-06-10-prozentrechner-design.md`
- 竞品研究：`prozentrechner-net-research.md`
- 视觉分析：`DESIGN-cal.md`
- 本交接文件：`.superpowers/handoff-2026-06-26-phase4-complete.md`

**已完成任务（HEAD = 4ee15ab）：**
- Task 34：`66bf4c5` Prozentsatz 页面 / `df746e5` Grundwert 页面 / `58a8c60` Prozentuale Veränderung 页面 / `7194450` Ab-/Zunahme 页面
- Task 35：`19b5973` TopNav 组件 + `lib/navigation.ts`
- Task 36：`192319e` Footer 组件
- Task 37：`959ea24` Breadcrumb 组件
- Task 38：`3b3ec17` Layout 接入 TopNav/Footer
- Task 39：`6a1da28` RelatedCalculators 组件
- Task 40：`a0d9feb` FAQBand 组件
- Task 41：`47e90f6` Quiz 组件 + 测试
- Task 42：`a1c90ac` CalculatorClient 扩展（breadcrumb、step-by-step、related、education+quiz、FAQ）
- Task 43：`200c82b` UniversalCalculator 首页组件
- Task 44：`05cf803` 首页 `/de/`
- Task 45：`4ee15ab` 所有 content YAML 验证测试

**已验证命令：**
```bash
npx vitest run          # 125 passed / 20 files
npx playwright test tests/e2e/smoke.spec.ts   # 1 passed
npm run build           # 成功，生成 /de/ 及 7 个模式页面
npm run dev
```

**下一步任务（按顺序继续 Phase 5）：**
1. **Task 46** `feat(a11y): add print stylesheet` — 在 `app/[locale]/globals.css` 添加 `@media print`，隐藏 nav/footer/related-calculators/quiz/history-drawer，显示 explanation-panel。
2. **Task 47** `feat(legal): add Impressum page` — 创建 `app/[locale]/impressum/page.tsx`。
3. **Task 48** `feat(legal): add Datenschutz page` — 创建 `app/[locale]/datenschutz/page.tsx`。
4. **Task 49** `feat(seo): add global hreflang and canonical metadata` — 更新 `app/[locale]/layout.tsx` metadata。
5. **Task 50** `feat(seo): add robots.txt and sitemap` — 创建 `app/robots.ts` + `app/sitemap.ts`。

然后进入 Phase 6（CMP、GA4、analytics、性能/a11y、Vercel、最终 QA）。

**关键工程决策：**
- next-intl@4.13.0，静态导出由 `NEXT_BUILD=1` 控制。
- `lib/navigation.ts` 提供 locale-aware `Link`。
- CalculatorClient 接收 `modeId: string` 并在 client 侧解析 mode。
- 所有文案走 next-intl；MVP 仅德语。
- 每个任务独立 commit；计算核心必须 TDD。
- 禁止修改 `prototypes/`，禁止提交 `.superpowers/handoff-*.md` 和 `test-results/`。

**开始动作：**
请先执行 `git status --short` 确认当前工作树，然后继续执行 Phase 5 的 Task 46。使用 Subagent-Driven Development，每个任务启动新鲜子 agent，父 agent review 输出并验证关键文件/测试结果。
