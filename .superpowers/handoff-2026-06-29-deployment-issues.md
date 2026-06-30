# ProzentRechner 部署问题交接文档

> 生成时间：2026-06-29
> 状态：Phase 6 实现已完成，但 Vercel 部署仍有待验证的问题

---

## 代码位置

- 工作目录：`d:/Projects/Prozentrechner/.worktrees/implementation`
- 分支：`feature/implementation`
- 当前 HEAD：`4035d74`
- 远程：`origin https://github.com/DevIanMu/prozentrechner.git`

---

## Phase 6 已完成内容

| Task | Commit | 说明 |
|---|---|---|
| 51 | `eda70e2` | Usercentrics CMP loader |
| 52 | `3c1545b` + `a6eedab` | GA4 consent mode + ID 校验 + consent update 监听 |
| 53 | `a0bccef` | GA4 事件辅助函数 |
| 54 | `b57a2e6` + `fccd7f3` + `f851eb9` | KaTeX CSS 懒加载、preconnect |
| 55 | `2dfad87` + `4abfd9b` | a11y 优化 |
| 56 | `dd3d0c7` + `d53f9e3` | Vercel 配置、HSTS、npm ci |
| 57 | `a48fbc9` + `69cad16` + `281e8c8` | 最终 QA、删除 prototypes、favicon、SRI、根路径重定向 |
| 追加 | `a455995` | `public/index.html` 根路径跳转（兼容纯静态托管） |
| 追加 | `6dab80f` | `vercel.json` `framework: null`，使用静态构建器 |
| 追加 | `4035d74` | 删除 `middleware.ts`（静态导出不支持 middleware） |

---

## 验证状态

- `npm run lint` ✅ 通过
- `npx vitest run` ✅ 23 files / 144 tests passed
- `npm run build` ⚠️ 本地 Windows 构建偶发 `EPERM`（见下方“已知问题”）
- Playwright smoke test ✅ 通过
- Lighthouse CI ✅ 断言通过（上一轮子 agent 运行）

---

## 已知未解决问题

### 1. 最新 commit 尚未推送到 GitHub

当前会话中本地 Git 已走到 `4035d74`，但本地网络无法稳定连接 GitHub，推送多次失败：

```
fatal: unable to access 'https://github.com/DevIanMu/prozentrechner.git/':
Recv failure: Connection was reset
```

**下一步：** 在新环境或网络正常时执行：

```bash
cd d:/Projects/Prozentrechner/.worktrees/implementation
git push origin feature/implementation
```

---

### 2. Vercel 部署曾报 `MIDDLEWARE_INVOCATION_FAILED`

错误截图显示 `500: INTERNAL_SERVER_ERROR`，Code: `MIDDLEWARE_INVOCATION_FAILED`。

**根因：** Next.js 静态导出（`output: 'export'`）不支持 `middleware.ts`。即使 `vercel.json` 把 `framework` 设为 `null`，只要 `middleware.ts` 存在，Vercel 仍可能尝试调用它。

**已做修复：**

- `6dab80f`：把 `vercel.json` 中的 `"framework": "nextjs"` 改为 `"framework": null`，让 Vercel 使用静态构建器而非 Next.js 服务端构建器。
- `4035d74`：删除 `middleware.ts`。

根路径跳转现在由以下两者共同保证：

1. `vercel.json` 中的 `redirects`：`/` → `/de/`
2. `public/index.html` 中的 meta refresh 跳转

**下一步：** 推送最新代码后，在 Vercel 重新部署，并观察是否还有 Middleware/Function 错误。

---

### 3. 本地 Windows 构建偶发 `EPERM` / `ENOTEMPTY`

在本地执行 `npm run build` 时，Next.js 生成 `dist/de/*/index.txt` 的过程中会偶发 `EPERM: operation not permitted` 或 `ENOTEMPTY: directory not empty`。

**根因：** Windows 下旧 `serve` 预览进程或系统索引服务锁住了 `dist/` 目录中的文件。

**已尝试：** 清理了多个遗留的 `npx serve` 进程。

**影响：** 这是本地 Windows 环境问题，Vercel 云端使用 Linux，预计不会遇到。

** workaround：** 若本地仍需构建，可尝试：

```bash
rmdir /s /q dist
npm run build
```

或在 WSL / GitHub Actions / Vercel 云端构建。

---

### 4. 上线前仍需替换的内容

`messages/de.json` 中的占位符需要替换为真实信息：

- `impressum.placeholders`
- `datenschutz.placeholders`

---

## Vercel 部署检查清单

推送最新代码后，在 Vercel 控制台确认：

1. **Framework Preset**：由于 `vercel.json` 已设置 `"framework": null`，Vercel 应显示为 Static 或 Other。
2. **Build Command**：`npm run build`（由 `vercel.json` 覆盖）
3. **Output Directory**：`dist`（由 `vercel.json` 覆盖）
4. **Install Command**：`npm ci`（由 `vercel.json` 覆盖）
5. **Environment Variables**（必须设置）：
   - `NEXT_PUBLIC_SITE_URL=https://deinedomain.de`
   - `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX`
   - `NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID=xxxxxxxxxx`
6. **Domains**：添加自定义域名并配置 DNS
7. **Usercentrics Admin**：把生产域名加入 Settings ID 的允许域名列表

---

## 给下一个对话的提示

打开新对话后，建议按以下顺序排查：

1. 先确认 `feature/implementation` 最新 commit 是否已推送到 GitHub。
2. 在 Vercel 重新部署，并获取完整部署日志（特别是红色错误、Functions 日志）。
3. 如果仍报 Middleware 错误，确认 `middleware.ts` 确实已从仓库中删除。
4. 如果报 `routes-manifest.json` 错误，确认 `vercel.json` 中 `"framework": null` 已生效。
5. 如果报 `dist/` 不存在或为空，确认 `next.config.js` 中 `output: 'export'` 和 `distDir: 'dist'` 正确，且 `npm run build` 成功生成 16 个静态页面。
6. 部署成功后，验证根域名 `/` 是否能正确跳转到 `/de/`。

