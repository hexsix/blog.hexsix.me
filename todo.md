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

- [x] **升级 Astro 6**（2026-08-20 完成）（上游 `6895f6a`）
      5.17.2 → 6.4.8，mdx 4 → 5，rss/sitemap/check 跟着小升。
      `experimental.fonts` → 顶层 `fonts:`；`experimental.preserveScriptOrder`
      在 6 里已是默认行为，直接删；`@ts-ignore`（Vite 7）删掉；
      `z` 改从 `astro/zod` 导入，顺手把弃用的 `z.string().url()` 换成 `z.url()`。
      Sriracha 换成本地 woff2（取上游那份），字体文件统一命名为 `wotfard.woff2`。
      升级过程中另外冒出来的三件事：
      1. `@shikijs/transformers` 3.x 与 astro 6 内置的 `@shikijs/types` 4.x
         类型不兼容，`astro check` 报 3 个 error，已升到 ^4.4.3。
      2. astro 6 弃用 `markdown.remarkPlugins`，改为
         `markdown.processor: unified({ remarkPlugins })`，
         `unified` 需要从 `@astrojs/markdown-remark` 直接导入 —— 已加为直接依赖。
      3. `<Font preload={[{ subset: "latin", ... }]} />` 这个过滤器只对
         Google provider 有效：本地字体没有 subset 元信息，
         而 `filter-preloads.js` 里 `p.subset !== subset` 不判 undefined，
         所以本地字体一个都匹配不上。升级前只有 Sriracha（Google）被 preload，
         Sriracha 改本地后 preload 归零。已改成正文字体 Wotfard 用 `preload`，
         其余三个（Sriracha / Fira Code / Cascadia Code）不 preload。
      **prefetch 不用配**：ClientRouter 内部就是以
      `{ prefetchAll: true }` + `defaultStrategy: "hover"` 初始化的
      （见 dist 里 ClientRouter 产物中的 `Ee({prefetchAll:!0})`），显式写等于重复。
      验证：新旧两次构建都是 156 页，逐页比对可见文本 0 处差异，
      head 里的 meta/link 除 generator 版本号外只有一页的 `"` 实体
      从 `&#34;` 变成 `&quot;`，JSON-LD 156 页全部一致。
      （同日又因 Dependabot 继续升到了 Astro 7，见下方条目。）

- [x] **每标签 OG 图**（2026-08-20 完成）（上游 `e5a0e29`）
      新增 `src/utils/og-templates/tag.js` + `/tags/[tag]/og.png.ts`
      + `generateOgImageForTag()`，标签页 `[...page].astro` 传 `ogImage`。
      共生成 86 张。`getStaticPaths` 刻意跟 `tags/[tag]/[...page].astro` 对齐
      （只取 blog 集合、数量走同一条 `getPostsByTag`），不照抄上游那版
      —— 上游把 galleries 也并进了标签体系，本地没有。
      副标题带了文章数（`共 N 篇文章 · Bubble`），长标签名按字数退字号
      （>10 字 56px / >6 字 72px / 否则 96px），最长的
      `rocketmq-client-cpp` 实测不溢出。

      **动手前发现已有的 OG 图全是坏的**，一并修了（这三条不在原计划里）：
      1. **中文全渲染成豆腐块**。`loadGoogleFont.ts` 加载的是 Noto Sans，
         它不含 CJK 字形，51 张文章图 + 站点图的中文标题、作者名、站点描述
         全是 □。换成 Noto Sans SC（同时覆盖拉丁 / 简中 / 日文假名）。
      2. `post.js` 里徽标写的是 `SITE.title + ".com"` → 渲染成 `Bubble.com`，
         而真实域名是 blog.hexsix.me。改成跟 `site.js` 一样取 `hostname`。
      3. `post.js` 的 `Escrito por`（西语"作者"）漏翻，改成「作者」。

- [x] **OG 字体加载改为整份缓存**（2026-08-20，做上一条时顺带）
      原做法给 Google Fonts 传 `&text=` 按需子集化，每张图 3 次往返
      （1 次 CSS + 2 个字重文件）。加上标签图后是 137 张 × 3 = 411 次请求，
      构建从 1m02s 涨到 3m06s，且任何一次失败都会让构建挂掉。
      先试过"一次 CSS 拿两个字重"，只降到 3m06s —— 实测瓶颈在字体文件本身
      （单张隔离测量：CSS 1.7s + 字体 1.9s）。
      改成整份 SC 字体只下一次、模块级缓存复用：一次 10.3s / 21MB，
      之后每张纯 CPU 约 285ms，satori 不会因字体大而反复付解析成本。
      **构建回到 1m02s，网络请求 411 → 3**，四张代表图逐像素比对完全一致。

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
- [x] **再升 Astro 7 + 清 Dependabot alerts**（2026-08-20 完成）
      起因：GitHub 报了一堆 Dependabot alert。本地没装 `gh`，用 `pnpm audit`
      代查（同一个 GitHub Advisory Database），升级前 45 条：3 low / 14 moderate / 28 high。
      其中三条是 astro 自身，patched 版本分别是 `>=7.0.4` / `>=7.0.6` / `>=7.1.0`
      —— **停在 Astro 6 无解**，所以直接上了 7.2.4。
      同批升的：mdx 5 → 7（多一个 `@astrojs/markdown-satteri` peer，astro 7 自己也依赖它）、
      sharp 0.34 → 0.35（`<0.35.0` 有 high）、tailwind 4.1 → 4.3、
      eslint 10.0 → 10.8、typescript-eslint 8.55 → 8.67、eslint-plugin-astro 1.6 → 3.1。
      `markdown.processor: unified()` 在 7 上照常工作，`@astrojs/markdown-remark`
      仍单独发版（astro 7 默认引擎换成 satteri，remark 链路是显式 opt-in）。
      剩下 12 条是被父包锁死的传递依赖，用 `pnpm.overrides` 顶版清零：
      `ajv@8` `fast-uri@3` `flatted` `mdast-util-to-hast` `picomatch@2` `smol-toml`。
      带 `@<major>` 选择器是因为 picomatch/ajv 树里同时存在多个大版本，
      不限定会误伤需要新版本的消费者。**最终 `pnpm audit`：0 条。**
      顺带：eslint-plugin-astro 3.x 修好了 `Layout.astro` 的 parsing error，
      再修掉 `posts/[...page].astro` 里的 `any` 和空 `@ts-expect-error`，
      `pnpm lint` 现在全绿。
      **唯一残留的 peer 警告**：`eslint-plugin-jsx-a11y@6.10.2`（eslint-plugin-astro 3.x
      的 peer）声明只支持到 eslint 9，而本地是 10。它是 latest，上游没更新
      peer range 而已，只是 WARN。

- [x] **Astro 7 的空白折叠变化**（2026-08-20，升级时发现并修复）
      Astro 7 收紧了 HTML 空白折叠，文本位置上"靠换行产生空格"的写法会失效。
      本仓库中招一处：`Footer.astro` 的
      `&copy; {currentYear}` ⏎ `{SITE.title}.` 渲染成了 `© 2026Bubble.`，
      已改成同一行显式空格。
      另一处 `index.astro:130` 的 `[{n}/` ⏎ `{total}]`，
      Astro 6 渲染为 `[6/ 49]`（多一个空格），7 渲染为 `[6/49]` —— 后者才是本意，不用改。
      排查方法留档：写了个扫描器找"文本位置上的相邻表达式"
      （要先剔除 `<style>`/`<script>` 块和标签内的多行属性，否则全是误报），
      自检两个已知样例后全库只剩这两处。

- [ ] `cedfcbe` — 全局音频 store + 顶栏迷你播放器（`config.ts` 里 `introAudio.enabled: false`，暂无意义）

- [x] **站点默认 OG 图切回自家生成的那张**（2026-08-20 完成）
      原先 `config.ts` 的 `ogImage: "devosfera-og.webp"` 指向上游的产品
      截图拼贴（画面里写着 "Devosfera"、西班牙语文案、AstroPaper 演示文章），
      首页 / 归档 / 关于 / 画廊 / 搜索 / 404 分享出去全是那张。
      置空后回退到构建时生成的 `/og.png`（Bubble / 小六家的藏宝图 / 域名）。
      顺带把 `og:image:width/height` 的硬编码 1200×630 也修对了 ——
      那张 webp 是 2560×1440，尺寸声明一直是错的；现在三类图
      （站点 / 文章 / 标签）实测均为 1200×630，声明与实际一致。
      **遗留**：`public/devosfera-og.webp`（152KB）已无人引用，
      但仍会被复制进 `dist/` 一起部署。要不要删你定。

## 已确认不做

- `1d08e9b` `c7b7f0f` `41507ae` 等西语→英语翻译提交 —— 本站为中文
- `d2815ae` 作者信息挪进 env 防 fork 刷屏 —— 模板仓库需求，个人博客反而更麻烦
- `4cba373` 移动端 backdrop-filter —— 本地 `69a97db` 已用自己的方案修复
- `41eb0eb` Pagefind 重复渲染 —— 本地 `442ad9d` 已修
- `2c44f16` cursor glow 性能 —— 本地 `Layout.astro:330` 已是 rAF
