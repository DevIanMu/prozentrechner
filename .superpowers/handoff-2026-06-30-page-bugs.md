# ProzentRechner 页面 Bug 修复交接文档

> 生成时间：2026-06-30
> 状态：Vercel 部署已修复，页面可正常访问，进入页面级 Bug 修复阶段

---

## 代码位置

- 工作目录：`d:/Projects/Prozentrechner/.worktrees/implementation`
- 分支：`feature/implementation`
- 本地 HEAD：`4035d74`
- 远程：`origin/feature/implementation`（已同步）
- 仓库：`https://github.com/DevIanMu/prozentrechner.git`

---

## 部署状态

- 生产地址：`https://prozentrechner-olive.vercel.app/`
- 当前线上 commit：`4035d74`
- 错误 `MIDDLEWARE_INVOCATION_FAILED` 已解决
- 根路径 `/` 可正常跳转到 `/de/`

---

## 已修复的部署问题

| Commit | 说明 |
|---|---|
| `6dab80f` | `vercel.json` 设置 `"framework": null`，使用静态构建器 |
| `4035d74` | 删除 `middleware.ts`，避免静态导出与 middleware 冲突 |

根路径跳转由以下两者共同保证：
1. `vercel.json` 中的 `redirects`：`/` → `/de/`
2. `public/index.html` 中的 meta refresh 跳转

---

## 常用命令

```bash
# 进入工作目录
cd d:/Projects/Prozentrechner/.worktrees/implementation

# 安装依赖
npm ci

# 开发服务器
npm run dev
# 默认访问 http://localhost:3000/de/

# 静态构建（生成 dist/ 目录）
npm run build

# 代码检查
npm run lint

# 单元测试
npm run test
# 或 npx vitest run

# E2E 测试
npm run test:e2e
```

---

## 项目结构

```
app/
  [locale]/           # 德语页面路由
    page.tsx          # 首页
    abzunahme/
    datenschutz/
    grundwert/
    impressum/
    mehrwertsteuer/
    prozentsatz/
    prozentuale-veraenderung/
    prozentwert/
    rabatt-berechnen/
  layout.tsx          # 根 layout
  robots.ts
  sitemap.ts

components/
  calculator/         # 计算器核心组件
  consent/            # Usercentrics CMP
  analytics/          # GA4 脚本
  layout/             # 顶部导航、面包屑、页脚
  ui/                 # shadcn/ui 基础组件
  faq-band.tsx
  quiz.tsx
  related-calculators.tsx

lib/
  calculations/       # 各类百分比计算逻辑 + 单元测试
  analytics.ts        # GA4 事件辅助函数
  content.ts          # 内容/FAQ 数据
  history.ts          # 本地历史记录
  navigation.ts       # next-intl 导航配置
  schema.ts           # JSON-LD 结构化数据

messages/de.json    # 德语文案（含占位符）
tests/              # 组件/逻辑测试
content/            # 可加载的内容文件
public/             # 静态资源
```

---

## 技术栈

- Next.js 14 + App Router
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- next-intl（仅客户端导航，无 middleware）
- KaTeX（公式渲染，懒加载）
- Usercentrics CMP + GA4 consent mode
- Vitest + Testing Library + Playwright

---

## 已知待处理问题

### 1. 占位符文案需替换

`messages/de.json` 中的以下占位符需要替换为真实内容：

- `impressum.placeholders`
- `datenschutz.placeholders`

### 2. 页面级 Bug

待下个对话根据实际页面表现逐一排查修复。建议优先检查：

- 各计算器页面输入、计算、结果显示是否正常
- 移动端布局与交互
- 历史记录功能
- FAQ 展开/折叠
- 导航、面包屑、页脚链接
-  consent banner 与 GA4 事件触发

---

## 给下一个对话的提示

1. 先运行 `npm run dev` 或查看线上地址确认当前页面状态。
2. 根据用户描述的具体 Bug，定位到对应组件或 `lib/calculations/` 逻辑。
3. 修改后运行 `npm run lint` 和 `npx vitest run` 确保不破坏现有测试。
4. 如涉及 UI 改动，可运行 Playwright smoke test 或手动截图验证。
5. 修复完成后按常规提交并推送（当前网络可正常访问 GitHub）。

---

## 环境变量示例

参见 `.env.example`：

```env
NEXT_PUBLIC_SITE_URL=https://deinedomain.de
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_USERCENTRICS_RULESET_ID=ets1lYjL4UT2rY
```

本地开发时复制为 `.env.local` 即可。
