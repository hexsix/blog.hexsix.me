// 用 SC 版：Noto Sans 不含 CJK 字形，中文标题会整片渲染成豆腐块。
// Noto Sans SC 同时覆盖拉丁、简体中文与日文假名，不需要再叠一层 Satori 字体回退。
const FONT_FAMILY = "Noto+Sans+SC";
const FONT_NAME = "Noto Sans SC";
const FONT_WEIGHTS = [400, 700];

// 伪装成旧版 Safari，Google Fonts 才会返回 truetype 而不是 woff2
const UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

type LoadedFont = {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: string;
};

// 整份字体只在首次调用时下载一次，之后全站共用。
//
// 原先的做法是给 Google Fonts 传 &text= 做按需子集化，每张 OG 图单独发请求。
// 那样每张图省下的是体积，但要付 3 次网络往返（1 次 CSS + 2 个字重文件），
// 全站一百多张图就是四百多次请求、两分多钟，且任何一次失败都会让构建挂掉。
// 整份 SC 字体两个字重合计约 21 MB、一次约 10 秒，之后每张图纯 CPU 约 285ms，
// satori 不会因为字体大而反复付解析成本。
let fontsPromise: Promise<LoadedFont[]> | null = null;

async function fetchGoogleFonts(): Promise<LoadedFont[]> {
  const API = `https://fonts.googleapis.com/css2?family=${FONT_FAMILY}:wght@${FONT_WEIGHTS.join(";")}`;

  const res = await fetch(API, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    throw new Error(`Failed to fetch font CSS. Status: ${res.status}`);
  }
  const css = await res.text();

  // 逐个 @font-face 解析字重与字体文件地址，避免依赖返回顺序
  const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].flatMap(
    ([, body]) => {
      const weight = body.match(/font-weight:\s*(\d+)/);
      const src = body.match(
        /src:\s*url\((.+?)\)\s*format\('(?:opentype|truetype)'\)/
      );
      return weight && src ? [{ weight: Number(weight[1]), url: src[1] }] : [];
    }
  );

  const missing = FONT_WEIGHTS.filter(w => !faces.some(f => f.weight === w));
  if (missing.length) {
    throw new Error(
      `Failed to download dynamic font. Missing weights: ${missing.join(", ")}`
    );
  }

  return Promise.all(
    faces.map(async ({ weight, url }) => {
      const fontRes = await fetch(url);
      if (!fontRes.ok) {
        throw new Error(
          `Failed to download dynamic font. Status: ${fontRes.status}`
        );
      }
      return {
        name: FONT_NAME,
        data: await fontRes.arrayBuffer(),
        weight,
        style: "normal",
      };
    })
  );
}

async function loadGoogleFonts(): Promise<LoadedFont[]> {
  fontsPromise ??= fetchGoogleFonts();
  return fontsPromise;
}

export default loadGoogleFonts;
