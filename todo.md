# 上游同步待办

上游：https://github.com/0xdres/astro-devosfera
分叉点：本地 `d390e2b init .` == 上游 `3cddb6a`（2026-02-25，无共同祖先，复制建仓）
待审范围：`3cddb6a..upstream/main`，24 个提交，2026-03-01 → 2026-06-09

拉取上游用：
```
git fetch https://github.com/0xdres/astro-devosfera.git main:refs/remotes/upstream/main
```

## P0

- [x] **修复全站 JSON-LD**（2026-08-20 完成）（上游 `e5a0e29` `5d804a8`）
      `src/layouts/Layout.astro:35` 无条件构造 `BlogPosting`、`:128` 无条件输出，
      非文章页（首页 / posts / tags / archives / galleries）会写出
      `"datePublished":"undefined"`。
      改为按 `isArticle` 分支：文章 → `BlogPosting`（补 `mainEntityOfPage`/`url`/`publisher`），
      首页 → `WebSite` + SearchAction，about → `ProfilePage`，其余不输出。
      实做时另加：画廊详情页输出 `ImageGallery` + `associatedMedia`；
      Layout 新增 `headline` prop，避免 JSON-LD 的 headline 带上 " | Bubble" 后缀；
      canonical 改为基于 `SITE.website` 生成并统一补尾斜杠。

## P1

- [x] **字体许可 · Cartograph 部分**（2026-08-20 完成）（上游 `3daac52`）
      `src/assets/fonts/cartograph-cf-regular-webfont.woff2` 需商业授权，
      本仓库公开且挂 MIT。上游已换 Fira Code（OFL 1.1）。
      已删除 cartograph woff2，取上游 `firacode.woff2`，
      全局把 `--font-cartograph` / `font-cartograph` / `Cartograph CF` 换成 firacode。
      **未决**：同仓 `wotfard-regular-webfont.woff2`（Atipo，商业字体）风险同性质，
      但它是正文字体、上游也没换，换掉会明显改变观感 —— 待决定。

- [x] **分页页 SEO**（2026-08-20 完成）（上游 `5d804a8`）
      `src/pages/posts/[...page].astro:23`、`src/pages/tags/[tag]/[...page].astro:33`
      第 2/3 页与第 1 页共用 title + description，且无 `rel="prev"/"next"`。
      Layout 加 `prev`/`next` prop，分页路由生成带页码的标题。
      顺带：`tags/[tag]/[...page].astro:37` 的 `pageDesc` 还是英文；
      同文件 `:39` 的 `<h1 slot="title">` 是死代码（Main.astro 无同名 slot）。
      已一并中文化 tag 页文案、删掉死 slot、给 about 页补专属 description，
      并补上 `og:site_name` / `og:type` / `og:locale` / `og:image` 尺寸。

## P2

- [ ] **升级 Astro 6**（上游 `6895f6a`）
      本地 5.17。`experimental.fonts` → 顶层 `fonts:`，
      干掉 `astro.config.ts:44` 的 `@ts-ignore`，
      `content.config.ts` 的 `z` 改从 `astro/zod` 导入。
      顺带加 `prefetch: { prefetchAll: true, defaultStrategy: "hover" }`，
      Sriracha 从 `fontProviders.google()` 换成本地 woff2。

- [ ] **每标签 OG 图**（上游 `e5a0e29`）
      新增 `src/utils/og-templates/tag.js` + `/tags/[tag]/og.png`，纯增量。

- [ ] **Header 性能**（借鉴上游 `687b73a`，不移植代码）
      本地 `Header.astro` 有 13 处 `transition: all`；滚动监听未用 rAF 包裹。

## P3

- [ ] **阅读时长**（上游 `2139f97`，需改造）
      上游 `getReadingTime()` 按空格切词，中文正文会全部显示 `< 1 min read`。
      要用得改成 CJK 字符计数（300–500 字/分钟）+ 中文文案。

## 可选

- [ ] `dbfeb4b` `ba10876` — `contentEntry.ts` 统一 blog/galleries 类型，画廊并入 RSS 与全局列表（本地画廊已自成一套，改造面大）
- [ ] `6c50eaa` `5d804a8` — Card 用 Astro `<Image>` 输出 AVIF/WebP + 响应式（需手工移植，本地 Card 86 行 vs 上游 304 行）
- [ ] `6965e10` `22324ef` — Breadcrumb 扩展 + `breadcrumbs.ts`；顺手删无人引用的 `BackButton.astro`
- [x] `cddfa56` — pnpm 为 esbuild/sharp 放行 build 脚本（2026-08-20 完成）
      配置写在 `package.json` 的 `pnpm.onlyBuiltDependencies`，不需要上游那个 `pnpm-workspace.yaml`。
      注意：改完配置后光跑 `pnpm install` 不会生效 —— 依赖图没变时 pnpm 走 no-op，
      不会重新链接包也就不会重跑 build script。需要 `pnpm rebuild esbuild sharp`
      或删掉 `node_modules` 重装才能验证。
- [ ] `cedfcbe` — 全局音频 store + 顶栏迷你播放器（`config.ts` 里 `introAudio.enabled: false`，暂无意义）

## 已确认不做

- `1d08e9b` `c7b7f0f` `41507ae` 等西语→英语翻译提交 —— 本站为中文
- `d2815ae` 作者信息挪进 env 防 fork 刷屏 —— 模板仓库需求，个人博客反而更麻烦
- `4cba373` 移动端 backdrop-filter —— 本地 `69a97db` 已用自己的方案修复
- `41eb0eb` Pagefind 重复渲染 —— 本地 `442ad9d` 已修
- `2c44f16` cursor glow 性能 —— 本地 `Layout.astro:330` 已是 rAF
