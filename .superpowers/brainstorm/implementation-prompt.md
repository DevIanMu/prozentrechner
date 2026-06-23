# ProzentRechner — 实施计划阶段提示词

> 复制以下内容到新对话的初始消息中。新 agent 应先调用 `writing-plans` skill，然后按该 skill 的格式输出完整实施计划。

---

## 初始消息

我正在构建 **ProzentRechner**（德语百分比计算器网站），直接对标 prozentrechner.net / blitzrechner.de。设计阶段已完成，现在需要进入**实施计划阶段**。

**请先调用 `writing-plans` skill**，然后基于本消息提供的信息和已批准的设计文档，输出一份完整的实施计划。

### 项目背景

- 目标：构建德语百分比计算器网站，核心差异化是实时计算、分步公式解释、会话历史、更好移动端体验。
- 目标用户：DACH 地区德语用户（学生、日常使用者）。
- 设计状态：已批准并更新。

### 已完成工作

1. **设计文档**：`docs/superpowers/specs/2026-06-10-prozentrechner-design.md`
   - 包含视觉设计系统、页面架构、组件规范、交互流程、内容策略、技术架构、7 个计算模式、已解决决策、6 阶段实施概览。
2. **原型验证**：`prototypes/`
   - `prototype-prozentrechner.html`：专注单模式页面 + 侧边解释面板（Variant A）
   - `prototype-prozentrechner-conversational.html`：首页对话式 Universal Calculator（Variant B）
   - 最终结论：**hybrid 方案** — 独立模式页面用 Variant A，首页用 Variant B。

### 已确定关键技术决策

| 领域 | 决策 |
|---|---|
| 框架 | Next.js 14+ App Router + SSG |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| 公式渲染 | KaTeX（通用公式静态预渲染，动态值客户端渲染） |
| 字体 | Inter + JetBrains Mono，通过 `next/font` 自托管 |
| i18n | `next-intl`，文案从第一天外部化，MVP 仅德语 |
| 分析 | Google Analytics 4 + Usercentrics CMP（6 个月内计划接 AdSense） |
| 部署 | Vercel |
| 数字格式 | 输入接受逗号/点和 `%`/`€` 后缀，输出 `de-DE` |
| URL 状态 | 用户输入同步到 hash；query 仅用于有限 SEO 示例；canonical 指向基础路径 |
| 历史 | 每模式 20 条 FIFO，2 秒无输入或 blur 后写入，跨标签同步 |
| Schema.org | 首页 `WebSite`+`Organization`；计算器页 `SoftwareApplication`+`FAQPage`；全站 `BreadcrumbList` |
| 测试 | Vitest + React Testing Library + Playwright + Lighthouse CI |

### 6 阶段实施概览（来自设计文档）

| 阶段 | 内容 |
|---|---|
| 1. Skeleton | Next.js + Tailwind + shadcn/ui + `next-intl` + 内容文件 Schema + CI/Lighthouse |
| 2. Calculation core | 计算函数、德语数字解析/格式化、状态管理、历史 |
| 3. First 3 modes | `Prozentwert`, `Rabatt`, `Mehrwertsteuer` 完整页面 |
| 4. Remaining modes + homepage | `Prozentsatz`, `Grundwert`, `Prozentuale Veränderung`, `Ab-/Zunahme`, `/` |
| 5. Content & SEO | 教育文、FAQ、测验、Schema.org JSON-LD、Impressum、Datenschutz |
| 6. Pre-launch | Usercentrics CMP、GA4、性能/a11y 优化、Vercel 部署 |

### 计划输出要求（严格遵循 `writing-plans` skill）

1. **保存位置**：`docs/superpowers/plans/YYYY-MM-DD-prozentrechner-implementation.md`
2. **文档头部**必须使用 `writing-plans` skill 规定的格式，包含 Goal / Architecture / Tech Stack。
3. **文件结构映射**：先定义会创建/修改的文件及职责，再分解任务。
4. **任务粒度**：每个任务 2-5 分钟可完成，包含具体代码/命令/预期输出。
5. **代码完整**：每个步骤如果需要写代码，必须给出完整代码，禁止 TBD/TODO/"稍后实现"。
6. **精确路径**：所有文件路径必须精确。
7. **TDD**：计算核心必须遵循测试先行。
8. **自我审查**：计划完成后对照设计文档检查覆盖度，列出任何缺口。
9. **执行交接**：最后提供 Subagent-Driven 与 Inline Execution 两种执行方式的选择。

### 计划必须覆盖的内容

- 项目初始化命令与目录结构
- Tailwind + shadcn/ui + next-intl 配置细节
- 内容文件 Schema（YAML/JSON）及消费方式
- 计算核心模块接口与完整单元测试用例
- 数字解析/格式化工具函数及边界测试
- 7 个计算模式的路由表与 Client Component 边界
- 组件拆分：CalculatorCard、ExplanationPanel、UniversalCalculator、HistoryDrawer、Quiz、FAQ、Footer、TopNav 等
- Schema.org JSON-LD 生成逻辑
- Usercentrics CMP + GA4 的集成方式与加载顺序
- Lighthouse CI 配置
- Impressum / Datenschutz 页面
- 风险与阻塞点
- MVP 可裁剪项
- 第一天可执行的第一组任务

### 约束

- 严格遵循已批准的设计文档 `docs/superpowers/specs/2026-06-10-prozentrechner-design.md`
- 不引入未决策的新技术栈
- 所有文案/内容走 `next-intl`，即使 MVP 只有德语
- 不修改 `prototypes/` 中的文件（仅用于验证，最终删除）
- 保持代码可测试、可访问、SEO 友好

### 参考文件

- 设计规范：`docs/superpowers/specs/2026-06-10-prozentrechner-design.md`
- 竞品研究：`prozentrechner-net-research.md`
- 视觉分析：`DESIGN-cal.md`
- 原型：`prototypes/`

请先阅读 `writing-plans` skill，然后通读设计文档，输出完整的实施计划。
